import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Eye, EyeOff, Heart, LogOut, MapPin, Package, User } from 'lucide-react'
import Img from '../components/Img'
import { Button, Empty, Field } from '../components/ui'
import { Page, ease } from '../components/Motion'
import { useStore } from '../context/StoreContext'
import { COLORS, LOOKS } from '../data/products'
import { formatDate, isEmail, maskCEP, maskPhone, money } from '../lib/utils'

function PasswordInput({ value, onChange, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div className="input-wrap">
      <input type={show ? 'text' : 'password'} value={value} onChange={onChange} {...props} />
      <button type="button" className="input-wrap__btn" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}>
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

function Auth() {
  const { login, register, notify } = useStore()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const back = params.get('voltar')
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (mode === 'register' && form.name.trim().length < 2) e.name = 'Informe seu nome.'
    if (!isEmail(form.email)) e.email = 'E-mail inválido.'
    if (form.password.length < 6) e.password = 'Mínimo de 6 caracteres.'
    if (mode === 'register' && form.confirm !== form.password) e.confirm = 'As senhas não coincidem.'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const u = mode === 'login' ? await login(form.email, form.password) : await register(form)
      notify(mode === 'login' ? `Bem-vindo de volta, ${u.name.split(' ')[0]}!` : 'Conta criada com sucesso!')
      if (back) navigate(back)
    } catch (err) {
      setErrors({ form: err.message })
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setMode('login')
    setForm({ name: '', email: 'demo@asfalto.com', password: 'asfalto123', confirm: '' })
    setErrors({})
  }

  return (
    <div className="auth">
      <div className="auth__media">
        <Img ids={[LOOKS.blackout3, LOOKS.hero]} alt="" width={1200} />
        <div className="auth__media-text">
          <span className="eyebrow eyebrow--light">Membros ASFALTO</span>
          <h2 className="display-md">Acesso antecipado, histórico de pedidos e favoritos sincronizados.</h2>
        </div>
      </div>

      <div className="auth__panel">
        <div className="seg" role="tablist">
          {[['login', 'Entrar'], ['register', 'Criar conta']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={mode === k} className={mode === k ? 'is-active' : ''} onClick={() => { setMode(k); setErrors({}) }}>
              {mode === k && <motion.span layoutId="seg" className="seg__bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{l}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form key={mode} onSubmit={submit} className="form" noValidate initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease }}>
            <h1 className="h2">{mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h1>
            {back === '/checkout' && <p className="muted">Entre ou cadastre-se para finalizar sua compra.</p>}

            {mode === 'register' && (
              <Field label="Nome completo" error={errors.name}>
                <input value={form.name} onChange={setF('name')} autoComplete="name" placeholder="Como devemos te chamar?" />
              </Field>
            )}
            <Field label="E-mail" error={errors.email}>
              <input type="email" value={form.email} onChange={setF('email')} autoComplete="email" placeholder="voce@email.com" />
            </Field>
            <Field label="Senha" error={errors.password}>
              <PasswordInput value={form.password} onChange={setF('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="••••••" />
            </Field>
            {mode === 'register' && (
              <Field label="Confirmar senha" error={errors.confirm}>
                <PasswordInput value={form.confirm} onChange={setF('confirm')} autoComplete="new-password" placeholder="••••••" />
              </Field>
            )}

            <AnimatePresence>
              {errors.form && (
                <motion.div className="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  {errors.form}
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" loading={loading} iconRight={ArrowRight} className="btn--block" size="lg">
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>

            <div className="demo-box">
              <span>Quer só testar? Use a conta demo com pedidos de exemplo.</span>
              <button type="button" className="link-under" onClick={fillDemo}>Preencher conta demo</button>
            </div>
            <p className="tiny">Ambiente de demonstração: os dados ficam salvos apenas no seu navegador (localStorage).</p>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ProfileForm() {
  const { user, updateProfile, notify, changePassword } = useStore()
  const [form, setForm] = useState({
    name: user.name, phone: user.phone || '',
    cep: user.address?.cep || '', street: user.address?.street || '', number: user.address?.number || '',
    complement: user.address?.complement || '', district: user.address?.district || '', city: user.address?.city || '', state: user.address?.state || '',
  })
  const [pw, setPw] = useState({ current: '', next: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const setF = (k, mask) => (e) => setForm((f) => ({ ...f, [k]: mask ? mask(e.target.value) : e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return setErrors({ name: 'Informe seu nome.' })
    setErrors({})
    setSaving(true)
    const { name, phone, ...address } = form
    const hasAddress = Object.values(address).some((v) => v.trim())
    await updateProfile({ name: name.trim(), phone, address: hasAddress ? address : null })
    setSaving(false)
    notify('Perfil atualizado')
  }

  const submitPw = async (e) => {
    e.preventDefault()
    if (pw.next.length < 6) return setErrors({ next: 'Mínimo de 6 caracteres.' })
    setErrors({})
    setSavingPw(true)
    try {
      await changePassword(pw.current, pw.next)
      notify('Senha alterada')
      setPw({ current: '', next: '' })
    } catch (err) {
      setErrors({ current: err.message })
    }
    setSavingPw(false)
  }

  return (
    <div className="profile-forms">
      <form className="form card" onSubmit={submit} noValidate>
        <h3>Dados pessoais</h3>
        <div className="form-grid">
          <Field label="Nome" error={errors.name}><input value={form.name} onChange={setF('name')} /></Field>
          <Field label="E-mail" hint="O e-mail não pode ser alterado."><input value={user.email} disabled /></Field>
          <Field label="Celular"><input value={form.phone} onChange={setF('phone', maskPhone)} inputMode="tel" placeholder="(11) 90000-0000" /></Field>
        </div>
        <h3><MapPin size={16} /> Endereço padrão</h3>
        <div className="form-grid form-grid--addr">
          <Field label="CEP"><input value={form.cep} onChange={setF('cep', maskCEP)} inputMode="numeric" placeholder="00000-000" /></Field>
          <Field label="Rua"><input value={form.street} onChange={setF('street')} /></Field>
          <Field label="Número"><input value={form.number} onChange={setF('number')} /></Field>
          <Field label="Complemento"><input value={form.complement} onChange={setF('complement')} /></Field>
          <Field label="Bairro"><input value={form.district} onChange={setF('district')} /></Field>
          <Field label="Cidade"><input value={form.city} onChange={setF('city')} /></Field>
          <Field label="UF"><input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))} /></Field>
        </div>
        <Button type="submit" loading={saving} variant="dark">Salvar alterações</Button>
      </form>

      <form className="form card" onSubmit={submitPw} noValidate>
        <h3>Alterar senha</h3>
        <div className="form-grid">
          <Field label="Senha atual" error={errors.current}><PasswordInput value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} autoComplete="current-password" /></Field>
          <Field label="Nova senha" error={errors.next}><PasswordInput value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} autoComplete="new-password" /></Field>
        </div>
        <Button type="submit" loading={savingPw} variant="outline">Atualizar senha</Button>
      </form>
    </div>
  )
}

function Orders() {
  const { user } = useStore()
  const [open, setOpen] = useState(user.orders[0]?.id)
  if (!user.orders.length)
    return <Empty icon={Package} title="Nenhum pedido ainda" text="Quando você finalizar uma compra, ela aparece aqui com todos os detalhes." action={<Button to="/loja" iconRight={ArrowRight}>Ir às compras</Button>} />
  return (
    <ul className="orders">
      {user.orders.map((o) => (
        <li key={o.id} className={`order card ${open === o.id ? 'is-open' : ''}`}>
          <button className="order__head" onClick={() => setOpen(open === o.id ? null : o.id)} aria-expanded={open === o.id}>
            <div><span className="muted">Pedido</span><strong>{o.id}</strong></div>
            <div><span className="muted">Data</span><strong>{formatDate(o.date)}</strong></div>
            <div><span className="muted">Total</span><strong>{money(o.total)}</strong></div>
            <span className={`status status--${o.status === 'Entregue' ? 'ok' : 'progress'}`}>{o.status}</span>
            <div className="order__thumbs">
              {o.items.slice(0, 3).map((i) => <Img key={i.id + i.size} ids={i.image} alt={i.name} width={120} />)}
            </div>
          </button>
          <AnimatePresence initial={false}>
            {open === o.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} style={{ overflow: 'hidden' }}>
                <div className="order__body">
                  <ul className="order__items">
                    {o.items.map((i) => (
                      <li key={i.id + i.size + i.color}>
                        <Img ids={i.image} alt={i.name} width={160} />
                        <div><strong>{i.name}</strong><span className="muted">{COLORS[i.color]?.name} · Tam. {i.size} · Qtd. {i.qty}</span></div>
                        <span>{money(i.price * i.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="order__summary">
                    <div><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
                    {o.discount > 0 && <div><span>Descontos</span><span>−{money(o.discount)}</span></div>}
                    <div><span>Frete ({o.shippingMethod})</span><span>{o.shipping ? money(o.shipping) : 'Grátis'}</span></div>
                    <div className="order__total"><span>Total</span><strong>{money(o.total)}</strong></div>
                    <span className="muted">Pagamento: {o.payment}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  )
}

function Dashboard() {
  const { user, logout, favorites } = useStore()
  const [tab, setTab] = useState('pedidos')
  const tabs = [
    { id: 'pedidos', label: 'Pedidos', icon: Package, count: user.orders.length },
    { id: 'perfil', label: 'Meus dados', icon: User },
  ]
  return (
    <div className="dash container">
      <aside className="dash__side">
        <div className="dash__user">
          <span className="avatar avatar--lg">{user.name.charAt(0)}</span>
          <div>
            <strong>{user.name}</strong>
            <span className="muted">{user.email}</span>
          </div>
        </div>
        <nav className="dash__nav">
          {tabs.map((t) => (
            <button key={t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
              {tab === t.id && <motion.span layoutId="dash-tab" className="dash__nav-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <t.icon size={18} /> <span>{t.label}</span> {t.count != null && <em>{t.count}</em>}
            </button>
          ))}
          <Link to="/favoritos"><Heart size={18} /> <span>Favoritos</span> <em>{favorites.length}</em></Link>
          <button onClick={logout} className="dash__logout"><LogOut size={18} /> <span>Sair</span></button>
        </nav>
      </aside>
      <section className="dash__main">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }}>
            <h1 className="h2">{tab === 'pedidos' ? 'Histórico de pedidos' : 'Meus dados'}</h1>
            {tab === 'pedidos' ? <Orders /> : <ProfileForm />}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  )
}

export default function Account() {
  const { user } = useStore()
  return <Page className="account">{user ? <Dashboard /> : <Auth />}</Page>
}
