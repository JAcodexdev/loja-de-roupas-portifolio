import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, CreditCard, Lock, QrCode, ShoppingBag } from 'lucide-react'
import Img from '../components/Img'
import { Button, Empty, Field, QtyPicker } from '../components/ui'
import { Page, ease } from '../components/Motion'
import { useStore } from '../context/StoreContext'
import { COLORS } from '../data/products'
import { SHIPPING, maskCard, maskCEP, maskCPF, maskExpiry, maskPhone, money, onlyDigits, shippingPrice } from '../lib/utils'

const COUPONS = { RUA10: 0.1 }

export default function Checkout() {
  const { user, cart, subtotal, updateQty, placeOrder, notify } = useStore()
  const navigate = useNavigate()
  const a = user?.address || {}
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', cpf: '',
    cep: a.cep || '', street: a.street || '', number: a.number || '', complement: a.complement || '', district: a.district || '', city: a.city || '', state: a.state || '',
    cardNumber: '', cardName: '', expiry: '', cvv: '', installments: '1',
  })
  const [method, setMethod] = useState('padrao')
  const [payment, setPayment] = useState('cartao')
  const [saveAddress, setSaveAddress] = useState(!user?.address)
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(null)
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)

  if (!user) return <Navigate to="/conta?voltar=/checkout" replace />

  const setF = (k, mask) => (e) => setForm((f) => ({ ...f, [k]: mask ? mask(e.target.value) : e.target.value }))
  const shipping = shippingPrice(method, subtotal)
  const discount = applied ? subtotal * COUPONS[applied] : 0
  const pixOff = payment === 'pix' ? (subtotal - discount) * 0.05 : 0
  const total = subtotal - discount - pixOff + shipping
  const inst = Math.min(6, Math.max(1, Math.floor(total / 50)))

  const applyCoupon = (e) => {
    e.preventDefault()
    const code = coupon.trim().toUpperCase()
    if (COUPONS[code]) {
      setApplied(code)
      notify(`Cupom ${code} aplicado`)
    } else {
      setErrors((er) => ({ ...er, coupon: 'Cupom inválido. Experimente RUA10.' }))
    }
  }

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = 'Informe o nome completo.'
    if (onlyDigits(form.phone).length < 10) e.phone = 'Telefone inválido.'
    if (onlyDigits(form.cpf).length !== 11) e.cpf = 'CPF deve ter 11 dígitos.'
    if (onlyDigits(form.cep).length !== 8) e.cep = 'CEP inválido.'
    if (!form.street.trim()) e.street = 'Obrigatório.'
    if (!form.number.trim()) e.number = 'Obrigatório.'
    if (!form.district.trim()) e.district = 'Obrigatório.'
    if (!form.city.trim()) e.city = 'Obrigatório.'
    if (form.state.trim().length !== 2) e.state = 'UF.'
    if (payment === 'cartao') {
      if (onlyDigits(form.cardNumber).length !== 16) e.cardNumber = 'Número deve ter 16 dígitos.'
      if (form.cardName.trim().length < 3) e.cardName = 'Nome como no cartão.'
      const [mm, yy] = form.expiry.split('/')
      if (!mm || !yy || +mm < 1 || +mm > 12 || yy.length !== 2) e.expiry = 'MM/AA.'
      if (onlyDigits(form.cvv).length < 3) e.cvv = 'CVV.'
    }
    setErrors(e)
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) {
      notify('Revise os campos destacados', 'error')
      document.querySelector('.has-error input, .has-error select')?.focus()
      return
    }
    setPlacing(true)
    const { cep, street, number, complement, district, city, state } = form
    const order = await placeOrder({
      address: { cep, street, number, complement, district, city, state },
      payment: payment === 'pix' ? 'Pix' : `Cartão final ${onlyDigits(form.cardNumber).slice(-4)} · ${form.installments}x`,
      shippingMethod: SHIPPING[method].name,
      shipping,
      saveAddress,
      discount: discount + pixOff,
    })
    navigate(`/pedido/${order.id}`, { replace: true })
  }

  if (!cart.length && !placing)
    return (
      <Page className="checkout container">
        <Empty icon={ShoppingBag} title="Seu carrinho está vazio" text="Adicione produtos para finalizar a compra." action={<Button to="/loja">Ir para a loja</Button>} />
      </Page>
    )

  return (
    <Page className="checkout">
      <div className="container">
        <div className="checkout__top">
          <Link to="/loja" className="link-under"><ArrowLeft size={16} /> Continuar comprando</Link>
          <span className="secure"><Lock size={14} /> Checkout de demonstração — nenhum pagamento real é processado</span>
        </div>
        <h1 className="display-md">Checkout</h1>

        <form className="checkout__layout" onSubmit={submit} noValidate>
          <div className="checkout__forms">
            <section className="card form">
              <h3><span className="step">1</span> Contato</h3>
              <div className="form-grid">
                <Field label="Nome completo" error={errors.name}><input value={form.name} onChange={setF('name')} autoComplete="name" /></Field>
                <Field label="Celular" error={errors.phone}><input value={form.phone} onChange={setF('phone', maskPhone)} inputMode="tel" placeholder="(11) 90000-0000" /></Field>
                <Field label="CPF" error={errors.cpf}><input value={form.cpf} onChange={setF('cpf', maskCPF)} inputMode="numeric" placeholder="000.000.000-00" /></Field>
                <Field label="E-mail"><input value={user.email} disabled /></Field>
              </div>
            </section>

            <section className="card form">
              <h3><span className="step">2</span> Endereço de entrega</h3>
              <div className="form-grid form-grid--addr">
                <Field label="CEP" error={errors.cep}><input value={form.cep} onChange={setF('cep', maskCEP)} inputMode="numeric" placeholder="00000-000" /></Field>
                <Field label="Rua" error={errors.street}><input value={form.street} onChange={setF('street')} autoComplete="address-line1" /></Field>
                <Field label="Número" error={errors.number}><input value={form.number} onChange={setF('number')} /></Field>
                <Field label="Complemento"><input value={form.complement} onChange={setF('complement')} placeholder="Opcional" /></Field>
                <Field label="Bairro" error={errors.district}><input value={form.district} onChange={setF('district')} /></Field>
                <Field label="Cidade" error={errors.city}><input value={form.city} onChange={setF('city')} /></Field>
                <Field label="UF" error={errors.state}><input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2) }))} placeholder="SP" /></Field>
              </div>
              <label className="check">
                <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                <span className="check__box" /><span className="check__label">Salvar como endereço padrão</span>
              </label>

              <h4 className="sub">Forma de envio</h4>
              <div className="radio-cards">
                {Object.values(SHIPPING).map((s) => {
                  const price = shippingPrice(s.id, subtotal)
                  return (
                    <label key={s.id} className={`radio-card ${method === s.id ? 'is-active' : ''}`}>
                      <input type="radio" name="ship" checked={method === s.id} onChange={() => setMethod(s.id)} />
                      <span className="radio-card__dot" />
                      <div><strong>{s.name}</strong><span>{s.eta}</span></div>
                      <em>{price ? money(price) : 'Grátis'}</em>
                    </label>
                  )
                })}
              </div>
            </section>

            <section className="card form">
              <h3><span className="step">3</span> Pagamento</h3>
              <div className="radio-cards radio-cards--row">
                {[['cartao', 'Cartão de crédito', CreditCard, 'Até 6x sem juros'], ['pix', 'Pix', QrCode, '5% de desconto']].map(([id, label, Icon, sub]) => (
                  <label key={id} className={`radio-card ${payment === id ? 'is-active' : ''}`}>
                    <input type="radio" name="pay" checked={payment === id} onChange={() => setPayment(id)} />
                    <Icon size={20} />
                    <div><strong>{label}</strong><span>{sub}</span></div>
                  </label>
                ))}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {payment === 'cartao' ? (
                  <motion.div key="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease }} style={{ overflow: 'hidden' }}>
                    <div className="card-pay">
                      <div className="cc">
                        <div className="cc__top"><span className="cc__chip" /><span className="cc__brand">ASFALTO</span></div>
                        <div className="cc__num">{form.cardNumber || '•••• •••• •••• ••••'}</div>
                        <div className="cc__bottom"><span>{form.cardName.toUpperCase() || 'NOME NO CARTÃO'}</span><span>{form.expiry || 'MM/AA'}</span></div>
                      </div>
                      <div className="form-grid">
                        <Field label="Número do cartão" error={errors.cardNumber} hint="Use qualquer número de 16 dígitos (demo)."><input value={form.cardNumber} onChange={setF('cardNumber', maskCard)} inputMode="numeric" placeholder="0000 0000 0000 0000" autoComplete="off" /></Field>
                        <Field label="Nome no cartão" error={errors.cardName}><input value={form.cardName} onChange={setF('cardName')} autoComplete="off" /></Field>
                        <Field label="Validade" error={errors.expiry}><input value={form.expiry} onChange={setF('expiry', maskExpiry)} inputMode="numeric" placeholder="MM/AA" autoComplete="off" /></Field>
                        <Field label="CVV" error={errors.cvv}><input value={form.cvv} onChange={setF('cvv', (v) => onlyDigits(v).slice(0, 4))} inputMode="numeric" placeholder="123" autoComplete="off" /></Field>
                        <Field label="Parcelas">
                          <select value={form.installments} onChange={setF('installments')}>
                            {Array.from({ length: inst }).map((_, i) => <option key={i} value={i + 1}>{i + 1}x de {money(total / (i + 1))} sem juros</option>)}
                          </select>
                        </Field>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="pix" className="pix" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease }} style={{ overflow: 'hidden' }}>
                    <div className="pix__inner">
                      <QrCode size={56} strokeWidth={1.2} />
                      <p>Ao confirmar, geramos um QR Code fictício. Nesta demonstração o pagamento é aprovado automaticamente.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          <aside className="summary card">
            <h3>Resumo do pedido</h3>
            <ul className="summary__items">
              <AnimatePresence initial={false}>
                {cart.map((i) => (
                  <motion.li key={i.key} layout exit={{ opacity: 0, height: 0 }}>
                    <div className="summary__img"><Img ids={i.product.images[0]} alt={i.product.name} width={160} /><b>{i.qty}</b></div>
                    <div className="summary__info">
                      <strong>{i.product.name}</strong>
                      <span className="muted">{COLORS[i.color]?.name} · {i.size}</span>
                      <QtyPicker small value={i.qty} onChange={(q) => updateQty(i.key, q)} />
                    </div>
                    <span>{money(i.qty * i.product.price)}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="coupon">
              <input value={coupon} onChange={(e) => { setCoupon(e.target.value); setErrors((er) => ({ ...er, coupon: null })) }} placeholder="Cupom de desconto" disabled={!!applied} aria-label="Cupom" onKeyDown={(e) => e.key === 'Enter' && applyCoupon(e)} />
              {applied ? (
                <button type="button" className="btn btn--outline btn--sm" onClick={() => { setApplied(null); setCoupon('') }}><span className="btn__label">Remover</span></button>
              ) : (
                <button type="button" className="btn btn--dark btn--sm" onClick={applyCoupon}><span className="btn__label">Aplicar</span></button>
              )}
            </div>
            {errors.coupon && <span className="field__error">{errors.coupon}</span>}

            <div className="summary__rows">
              <div><span>Subtotal</span><span>{money(subtotal)}</span></div>
              {applied && <div className="is-discount"><span>Cupom {applied}</span><span>−{money(discount)}</span></div>}
              {pixOff > 0 && <div className="is-discount"><span>Desconto Pix (5%)</span><span>−{money(pixOff)}</span></div>}
              <div><span>Frete · {SHIPPING[method].name}</span><span>{shipping ? money(shipping) : 'Grátis'}</span></div>
              <div className="summary__total">
                <span>Total</span>
                <motion.strong key={total.toFixed(2)} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{money(total)}</motion.strong>
              </div>
            </div>
            <Button type="submit" variant="accent" size="lg" className="btn--block" loading={placing} icon={Lock}>
              {placing ? 'Processando pedido…' : 'Confirmar pedido'}
            </Button>
            <p className="tiny">Ao confirmar você concorda com os <Link to="/info/termos" className="link-under">termos da loja</Link>. Nenhuma cobrança será feita.</p>
          </aside>
        </form>
      </div>
    </Page>
  )
}
