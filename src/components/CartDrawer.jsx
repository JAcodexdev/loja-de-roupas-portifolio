import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import Img from './Img'
import { Button, QtyPicker } from './ui'
import { useStore } from '../context/StoreContext'
import { COLORS } from '../data/products'
import { FREE_SHIPPING, money } from '../lib/utils'
import { ease } from './Motion'

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, subtotal, updateQty, removeFromCart, cartCount, user } = useStore()
  const navigate = useNavigate()
  const remaining = Math.max(0, FREE_SHIPPING - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100)
  const close = () => setCartOpen(false)

  useEffect(() => {
    if (!cartOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [cartOpen])

  const goCheckout = () => {
    close()
    navigate(user ? '/checkout' : '/conta?voltar=/checkout')
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="overlay" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
          <motion.aside
            className="drawer"
            role="dialog"
            aria-label="Carrinho"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="drawer__head">
              <h2>Carrinho <span>({cartCount})</span></h2>
              <button className="icon-btn" onClick={close} aria-label="Fechar carrinho"><X size={22} /></button>
            </div>

            {cart.length === 0 ? (
              <div className="drawer__empty">
                <motion.span className="empty__icon" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <ShoppingBag size={28} strokeWidth={1.4} />
                </motion.span>
                <h3>Seu carrinho está vazio</h3>
                <p>Bora encher? Os lançamentos do Drop 07 estão esperando por você.</p>
                <Button to="/loja" onClick={close} iconRight={ArrowRight}>Explorar a loja</Button>
              </div>
            ) : (
              <>
                <div className="ship-bar">
                  <div className="ship-bar__text">
                    <Truck size={16} />
                    {remaining > 0 ? (
                      <span>Faltam <strong>{money(remaining)}</strong> para frete grátis</span>
                    ) : (
                      <span><strong>Frete grátis</strong> desbloqueado</span>
                    )}
                  </div>
                  <div className="ship-bar__track">
                    <motion.div className="ship-bar__fill" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease }} />
                  </div>
                </div>

                <ul className="drawer__list">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.li
                        key={item.key}
                        layout
                        className="citem"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}
                        transition={{ duration: 0.4, ease }}
                      >
                        <Link to={`/produto/${item.product.slug}`} onClick={close} className="citem__img">
                          <Img ids={item.product.images[0]} alt={item.product.name} width={240} />
                        </Link>
                        <div className="citem__body">
                          <div className="citem__top">
                            <Link to={`/produto/${item.product.slug}`} onClick={close} className="citem__name">{item.product.name}</Link>
                            <button className="icon-btn icon-btn--sm" onClick={() => removeFromCart(item.key)} aria-label={`Remover ${item.product.name}`}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <span className="citem__meta">{COLORS[item.color]?.name} · Tam. {item.size}</span>
                          <div className="citem__bottom">
                            <QtyPicker small value={item.qty} onChange={(q) => updateQty(item.key, q)} />
                            <motion.strong key={item.qty} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}>{money(item.qty * item.product.price)}</motion.strong>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="drawer__foot">
                  <div className="drawer__row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                  <div className="drawer__row drawer__row--muted"><span>Frete</span><span>{remaining > 0 ? 'Calculado no checkout' : 'Grátis'}</span></div>
                  <Button onClick={goCheckout} iconRight={ArrowRight} className="btn--block">Finalizar compra</Button>
                  <button className="link-under" onClick={close}>Continuar comprando</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
