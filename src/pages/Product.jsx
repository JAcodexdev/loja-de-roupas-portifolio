import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Heart, Ruler, RotateCcw, ShoppingBag, Star, Truck } from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import { Button, QtyPicker, SectionHead } from '../components/ui'
import { Page, Stagger, StaggerItem, ease } from '../components/Motion'
import { useStore } from '../context/StoreContext'
import { COLORS, PRODUCTS, categoryName, getProduct } from '../data/products'
import { installments, money, wait } from '../lib/utils'
import NotFound from './NotFound'

function Gallery({ product }) {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const [zoom, setZoom] = useState(null)
  const total = product.images.length
  const go = (i) => {
    setDir(i > active ? 1 : -1)
    setActive((i + total) % total)
  }

  return (
    <div className="gallery">
      {total > 1 && (
        <div className="gallery__thumbs">
          {product.images.map((id, i) => (
            <button key={id} className={`gallery__thumb ${i === active ? 'is-active' : ''}`} onClick={() => go(i)} aria-label={`Ver imagem ${i + 1}`}>
              <Img ids={id} alt="" width={200} />
            </button>
          ))}
        </div>
      )}
      <div
        className="gallery__main"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={active}
            className="gallery__slide"
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.55, ease }}
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(active + 1)
              else if (info.offset.x > 60) go(active - 1)
            }}
            style={zoom ? { '--zx': `${zoom.x}%`, '--zy': `${zoom.y}%` } : undefined}
          >
            <Img ids={product.images[active]} alt={`${product.name} — imagem ${active + 1}`} width={1400} eager className={zoom ? 'is-zoomed' : ''} label={product.name} />
          </motion.div>
        </AnimatePresence>
        {total > 1 && (
          <>
            <button className="gallery__nav gallery__nav--prev" onClick={() => go(active - 1)} aria-label="Imagem anterior"><ChevronLeft size={20} /></button>
            <button className="gallery__nav gallery__nav--next" onClick={() => go(active + 1)} aria-label="Próxima imagem"><ChevronRight size={20} /></button>
            <div className="gallery__dots">
              {product.images.map((_, i) => <span key={i} className={i === active ? 'is-active' : ''} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="accordion">
      {items.map((it, i) => (
        <div key={it.title} className="accordion__item">
          <button className="accordion__head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {it.title}
            <motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} style={{ overflow: 'hidden' }}>
                <div className="accordion__body">{it.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const navigate = useNavigate()
  const { addToCart, toggleFavorite, isFavorite, setCartOpen, notify } = useStore()
  const [color, setColor] = useState(product?.colors[0])
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [status, setStatus] = useState('idle')
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    if (!product) return
    setColor(product.colors[0])
    setSize(product.sizes.length === 1 && !product.sizesOut.includes(product.sizes[0]) ? product.sizes[0] : null)
    setQty(1)
    setStatus('idle')
    setSizeError(false)
  }, [slug])

  if (!product) return <NotFound />

  const fav = isFavorite(product.id)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id)
    .concat(PRODUCTS.filter((p) => p.category !== product.category && p.collection === product.collection && product.collection))
    .slice(0, 4)
  const fillRelated = related.length < 4 ? related.concat(PRODUCTS.filter((p) => p.id !== product.id && !related.includes(p)).sort((a, b) => b.sold - a.sold).slice(0, 4 - related.length)) : related

  const add = async (buyNow = false) => {
    if (!size) {
      setSizeError(true)
      notify('Selecione um tamanho', 'error')
      return
    }
    setStatus('loading')
    await wait(550)
    addToCart(product, { size, color, qty })
    setStatus('done')
    if (buyNow) navigate('/checkout')
    else setTimeout(() => setCartOpen(true), 350)
    setTimeout(() => setStatus('idle'), 1800)
  }

  return (
    <Page className="pdp">
      <div className="container">
        <nav className="crumbs">
          <Link to="/">Início</Link><span>/</span>
          <Link to={`/loja?categoria=${product.category}`}>{categoryName(product.category)}</Link><span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="pdp__layout">
          <Gallery product={product} />

          <motion.div className="pdp__info" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease, delay: 0.1 }}>
            <div className="pdp__tags">
              {product.isNew && <span className="badge badge--accent">Novo</span>}
              {discount > 0 && <span className="badge">-{discount}%</span>}
              {product.collection === 'blackout' && <span className="badge badge--dark">Blackout</span>}
            </div>
            <h1 className="pdp__title">{product.name}</h1>
            <div className="pdp__rating">
              <span className="stars" aria-label={`Avaliação ${product.rating} de 5`}>
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />)}
              </span>
              <span>{product.rating.toFixed(1)} · {Math.round(product.sold / 9)} avaliações · {product.sold.toLocaleString('pt-BR')} vendidos</span>
            </div>

            <div className="pdp__price">
              <strong>{money(product.price)}</strong>
              {product.oldPrice && <s>{money(product.oldPrice)}</s>}
            </div>
            <span className="pdp__inst">{installments(product.price)} · 5% off no Pix</span>

            <p className="pdp__desc">{product.description}</p>

            <div className="opt">
              <div className="opt__head"><span>Cor</span><strong>{COLORS[color]?.name}</strong></div>
              <div className="swatches">
                {product.colors.map((c) => (
                  <button key={c} className={`swatch ${c === color ? 'is-active' : ''}`} onClick={() => setColor(c)} aria-label={COLORS[c].name} aria-pressed={c === color}>
                    <span style={{ background: COLORS[c].hex }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="opt">
              <div className="opt__head">
                <span>Tamanho</span>
                <Link to="/info/medidas" className="link-under"><Ruler size={14} /> Guia de medidas</Link>
              </div>
              <motion.div className="sizes" animate={sizeError ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.4 }}>
                {product.sizes.map((s) => {
                  const out = product.sizesOut.includes(s)
                  return (
                    <button
                      key={s}
                      className={`size-btn size-btn--lg ${size === s ? 'is-active' : ''} ${out ? 'is-out' : ''}`}
                      disabled={out}
                      onClick={() => { setSize(s); setSizeError(false) }}
                      aria-pressed={size === s}
                      title={out ? 'Esgotado' : `Tamanho ${s}`}
                    >
                      {s}
                    </button>
                  )
                })}
              </motion.div>
              {sizeError && <span className="field__error">Escolha um tamanho para continuar.</span>}
              {product.sizesOut.length > 0 && <span className="opt__note">Tamanhos riscados estão esgotados.</span>}
            </div>

            <div className="pdp__buy">
              <QtyPicker value={qty} onChange={setQty} />
              <motion.button
                className={`btn btn--primary btn--lg pdp__add ${status === 'done' ? 'is-done' : ''}`}
                onClick={() => add(false)}
                disabled={status === 'loading'}
                whileTap={{ scale: 0.97 }}
              >
                <span className="btn__fill" />
                <span className="btn__label">
                  <AnimatePresence mode="wait" initial={false}>
                    {status === 'loading' ? (
                      <motion.span key="l" className="row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <span className="dots"><i /><i /><i /></span> Adicionando
                      </motion.span>
                    ) : status === 'done' ? (
                      <motion.span key="d" className="row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Check size={18} /> Adicionado ao carrinho
                      </motion.span>
                    ) : (
                      <motion.span key="i" className="row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <ShoppingBag size={18} /> Adicionar · {money(product.price * qty)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
              <motion.button
                className={`icon-square ${fav ? 'is-active' : ''}`}
                onClick={() => toggleFavorite(product)}
                whileTap={{ scale: 0.85 }}
                aria-label={fav ? 'Remover dos favoritos' : 'Favoritar'}
                aria-pressed={fav}
              >
                <motion.span key={String(fav)} initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
                  <Heart size={20} fill={fav ? 'currentColor' : 'none'} />
                </motion.span>
              </motion.button>
            </div>
            <Button variant="outline" className="btn--block" onClick={() => add(true)} iconRight={ArrowRight}>Comprar agora</Button>

            <ul className="pdp__perks">
              <li><Truck size={18} /> Frete grátis acima de R$ 399 · entrega em todo o Brasil</li>
              <li><RotateCcw size={18} /> Primeira troca grátis em até 30 dias</li>
            </ul>

            <Accordion
              items={[
                { title: 'Detalhes do produto', content: <ul className="bullets">{product.details.map((d) => <li key={d}>{d}</li>)}</ul> },
                { title: 'Cuidados', content: <p>Lave do avesso em água fria, não use alvejante e seque à sombra. Não passe ferro sobre estampas ou bordados.</p> },
                { title: 'Envio e trocas', content: <p>Postagem em até 1 dia útil. Entrega padrão de 5 a 8 dias úteis ou expressa de 1 a 3. Trocas pelo site em até 30 dias após o recebimento. <Link to="/info/trocas" className="link-under">Saiba mais</Link></p> },
              ]}
            />
          </motion.div>
        </div>
      </div>

      <section className="section container">
        <SectionHead eyebrow="Complete o look" title="Você também pode curtir" />
        <Stagger className="grid grid--4">
          {fillRelated.map((p) => <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>)}
        </Stagger>
      </section>

    </Page>
  )
}
