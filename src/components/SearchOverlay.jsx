import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Search, X } from 'lucide-react'
import Img from './Img'
import { PRODUCTS, CATEGORIES, categoryName } from '../data/products'
import { money } from '../lib/utils'
import { ease } from './Motion'

export const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const TAGS = {
  camisetas: 'camiseta camisetas tee t-shirt blusa',
  calcas: 'calca calcas calça jeans cargo',
  moletons: 'moletom moletons hoodie casaco agasalho',
  jaquetas: 'jaqueta jaquetas casaco bomber corta-vento',
  acessorios: 'acessorio acessorios bone gorro bolsa',
}

export const searchProducts = (q) => {
  const n = normalize(q.trim())
  if (!n) return []
  return PRODUCTS.filter((p) => normalize(`${p.name} ${categoryName(p.category)} ${TAGS[p.category] || ''} ${p.colors.join(' ')} ${p.description}`).includes(n))
}

const SUGGESTIONS = ['moletom', 'cargo', 'bomber', 'jeans', 'boné', 'oversized']

export default function SearchOverlay({ onClose }) {
  const [q, setQ] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const results = useMemo(() => searchProducts(q).slice(0, 6), [q])

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    navigate(`/loja?busca=${encodeURIComponent(q.trim())}`)
    onClose()
  }

  return (
    <motion.div className="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="search__panel"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.45, ease }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Buscar produtos"
      >
        <form onSubmit={submit} className="search__form container">
          <Search size={22} />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="O que você procura?" aria-label="Buscar" />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar busca"><X size={22} /></button>
        </form>

        <div className="search__body container">
          {!q.trim() ? (
            <div className="search__suggest">
              <span className="eyebrow">Buscas populares</span>
              <div className="chips">
                {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>)}
              </div>
              <span className="eyebrow" style={{ marginTop: 24 }}>Categorias</span>
              <div className="chips">
                {CATEGORIES.map((c) => <Link key={c.slug} className="chip" to={`/loja?categoria=${c.slug}`} onClick={onClose}>{c.name}</Link>)}
              </div>
            </div>
          ) : results.length ? (
            <>
              <ul className="search__results">
                <AnimatePresence initial={false}>
                  {results.map((p, i) => (
                    <motion.li key={p.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }} exit={{ opacity: 0 }}>
                      <Link to={`/produto/${p.slug}`} onClick={onClose} className="search__item">
                        <Img ids={p.images[0]} alt={p.name} width={200} className="search__thumb" />
                        <div>
                          <strong>{p.name}</strong>
                          <span>{categoryName(p.category)}</span>
                        </div>
                        <span className="search__price">{money(p.price)}</span>
                      </Link>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <button className="link-arrow" onClick={submit}>
                Ver todos os resultados para “{q}” <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <p className="search__none">Nenhum produto encontrado para “{q}”. Tente “moletom” ou “jaqueta”.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
