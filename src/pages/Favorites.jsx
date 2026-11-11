import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Heart, ShoppingBag, X } from 'lucide-react'
import Img from '../components/Img'
import { Button, Empty } from '../components/ui'
import { Page, ease } from '../components/Motion'
import { useStore } from '../context/StoreContext'
import { categoryName, getById } from '../data/products'
import { money } from '../lib/utils'

export default function Favorites() {
  const { favorites, toggleFavorite, addToCart, notify, setCartOpen } = useStore()
  const items = favorites.map(getById).filter(Boolean)

  const moveAll = () => {
    let added = 0
    items.forEach((p) => {
      const size = p.sizes.find((s) => !p.sizesOut.includes(s))
      if (size) {
        addToCart(p, { size: p.sizes.includes('M') && !p.sizesOut.includes('M') ? 'M' : size, color: p.colors[0], qty: 1 })
        added++
      }
    })
    notify(`${added} ${added === 1 ? 'item adicionado' : 'itens adicionados'} ao carrinho`)
    setCartOpen(true)
  }

  return (
    <Page className="favs">
      <section className="page-hero container">
        <nav className="crumbs"><Link to="/">Início</Link><span>/</span><span>Favoritos</span></nav>
        <div className="page-hero__row">
          <h1 className="display-md">Favoritos <sup>{items.length}</sup></h1>
          {items.length > 0 && <Button variant="dark" onClick={moveAll} icon={ShoppingBag}>Adicionar todos ao carrinho</Button>}
        </div>
        {items.length > 0 && <p className="muted">No carrinho, os itens entram no tamanho M (ou no primeiro disponível) — você pode ajustar depois.</p>}
      </section>

      <div className="container">
        {items.length === 0 ? (
          <Empty
            icon={Heart}
            title="Nenhum favorito ainda"
            text="Toque no coração das peças que você curtir para salvá-las aqui. Elas ficam guardadas mesmo se você fechar o navegador."
            action={<Button to="/loja" iconRight={ArrowRight}>Explorar produtos</Button>}
          />
        ) : (
          <motion.ul layout className="fav-list">
            <AnimatePresence initial={false} mode="popLayout">
              {items.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  className="fav-item"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease } }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                >
                  <Link to={`/produto/${p.slug}`} className="fav-item__img"><Img ids={p.images[0]} alt={p.name} width={600} /></Link>
                  <button className="fav-item__remove" onClick={() => toggleFavorite(p)} aria-label={`Remover ${p.name} dos favoritos`}><X size={16} /></button>
                  <div className="fav-item__info">
                    <span className="muted">{categoryName(p.category)}</span>
                    <Link to={`/produto/${p.slug}`} className="fav-item__name">{p.name}</Link>
                    <strong>{money(p.price)}</strong>
                  </div>
                  <Button to={`/produto/${p.slug}`} variant="outline" size="sm" className="btn--block">Escolher tamanho</Button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </Page>
  )
}
