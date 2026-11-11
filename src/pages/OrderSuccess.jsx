import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Package } from 'lucide-react'
import Img from '../components/Img'
import { Button } from '../components/ui'
import { Page, ease } from '../components/Motion'
import { useStore } from '../context/StoreContext'
import { COLORS } from '../data/products'
import { money } from '../lib/utils'
import NotFound from './NotFound'

export default function OrderSuccess() {
  const { id } = useParams()
  const { user } = useStore()
  const order = user?.orders.find((o) => o.id === id)
  if (!order) return <NotFound />
  const a = order.address

  return (
    <Page className="success container">
      <div className="success__card">
        <svg className="success__check" viewBox="0 0 80 80" aria-hidden>
          <motion.circle cx="40" cy="40" r="36" fill="none" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease }} />
          <motion.path d="M24 41 L35 52 L57 29" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7, ease }} />
        </svg>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6, ease }}>
          <span className="eyebrow">Pedido {order.id}</span>
          <h1 className="display-md">Pedido confirmado.</h1>
          <p className="muted">
            Valeu, {user.name.split(' ')[0]}! Seu pedido já está em separação. Esta é uma loja de demonstração —
            nenhuma cobrança foi feita e nada será enviado.
          </p>
        </motion.div>

        <motion.div className="success__grid" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6, ease }}>
          <div className="card">
            <h4>Itens</h4>
            <ul className="order__items">
              {order.items.map((i) => (
                <li key={i.id + i.size + i.color}>
                  <Img ids={i.image} alt={i.name} width={160} />
                  <div><strong>{i.name}</strong><span className="muted">{COLORS[i.color]?.name} · Tam. {i.size} · Qtd. {i.qty}</span></div>
                  <span>{money(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card success__meta">
            <h4>Entrega</h4>
            {a && <p>{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ''}<br />{a.district} · {a.city}/{a.state}<br />CEP {a.cep}</p>}
            <p className="muted">{order.shippingMethod}</p>
            <h4>Pagamento</h4>
            <p>{order.payment}</p>
            <div className="order__summary">
              <div><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
              {order.discount > 0 && <div><span>Descontos</span><span>−{money(order.discount)}</span></div>}
              <div><span>Frete</span><span>{order.shipping ? money(order.shipping) : 'Grátis'}</span></div>
              <div className="order__total"><span>Total</span><strong>{money(order.total)}</strong></div>
            </div>
          </div>
        </motion.div>

        <div className="success__actions">
          <Button to="/conta" variant="dark" icon={Package}>Ver meus pedidos</Button>
          <Button to="/loja" variant="outline" iconRight={ArrowRight}>Continuar comprando</Button>
        </div>
        <Link to="/" className="link-under">Voltar ao início</Link>
      </div>
    </Page>
  )
}
