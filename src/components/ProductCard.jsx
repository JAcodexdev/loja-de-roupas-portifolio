import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Heart, Plus } from 'lucide-react'
import Img from './Img'
import { ColorDot } from './ui'
import { useStore } from '../context/StoreContext'
import { categoryName } from '../data/products'
import { money } from '../lib/utils'

export default function ProductCard({ product, priority }) {
  const { toggleFavorite, isFavorite, addToCart, notify } = useStore()
  const [added, setAdded] = useState(null)
  const fav = isFavorite(product.id)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const available = product.sizes.filter((s) => !product.sizesOut.includes(s))

  const quickAdd = (size) => {
    addToCart(product, { size, color: product.colors[0], qty: 1 })
    setAdded(size)
    notify(`${product.name} (${size}) adicionado ao carrinho`)
    setTimeout(() => setAdded(null), 1400)
  }

  return (
    <article className="pcard">
      <div className="pcard__media">
        <Link to={`/produto/${product.slug}`} className="pcard__link" aria-label={product.name}>
          <Img ids={product.images[0]} alt={product.name} width={800} eager={priority} className="pcard__img" label={product.name} />
          {product.images[1] && (
            <Img ids={product.images[1]} alt="" width={800} className="pcard__img pcard__img--alt" />
          )}
        </Link>

        <div className="pcard__badges">
          {product.isNew && <span className="badge badge--accent">Novo</span>}
          {discount > 0 && <span className="badge">-{discount}%</span>}
          {product.collection === 'blackout' && <span className="badge badge--dark">Blackout</span>}
        </div>

        <motion.button
          className={`pcard__fav ${fav ? 'is-active' : ''}`}
          onClick={() => toggleFavorite(product)}
          whileTap={{ scale: 0.8 }}
          aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={fav}
        >
          <motion.span key={String(fav)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Heart size={18} strokeWidth={1.8} fill={fav ? 'currentColor' : 'none'} />
          </motion.span>
        </motion.button>

        <div className="pcard__quick">
          <span className="pcard__quick-title">
            <Plus size={14} /> Adicionar rápido
          </span>
          <div className="pcard__sizes">
            {product.sizes.map((s) => {
              const out = !available.includes(s)
              return (
                <button key={s} disabled={out} onClick={() => quickAdd(s)} className={added === s ? 'is-added' : ''} aria-label={`Adicionar tamanho ${s}`}>
                  <AnimatePresence mode="wait" initial={false}>
                    {added === s ? (
                      <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={14} />
                      </motion.span>
                    ) : (
                      <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {s}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <Link to={`/produto/${product.slug}`} className="pcard__info">
        <div className="pcard__row">
          <h3 className="pcard__name">{product.name}</h3>
          <div className="pcard__price">
            {product.oldPrice && <s>{money(product.oldPrice)}</s>}
            <span>{money(product.price)}</span>
          </div>
        </div>
        <div className="pcard__row pcard__meta">
          <span>{categoryName(product.category)}</span>
          <span className="pcard__colors">
            {product.colors.map((c) => <ColorDot key={c} color={c} size={10} />)}
          </span>
        </div>
      </Link>
    </article>
  )
}
