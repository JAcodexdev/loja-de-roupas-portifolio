import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, SearchX, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { Button, Empty } from '../components/ui'
import { Page, ease } from '../components/Motion'
import { searchProducts } from '../components/SearchOverlay'
import { CATEGORIES, PRODUCTS, SIZES, categoryName } from '../data/products'
import { money } from '../lib/utils'

const SORTS = [
  { id: 'relevancia', label: 'Relevância' },
  { id: 'populares', label: 'Mais populares' },
  { id: 'novos', label: 'Lançamentos' },
  { id: 'menor', label: 'Menor preço' },
  { id: 'maior', label: 'Maior preço' },
]

const PRICE_RANGES = [
  { label: 'Até R$ 150', min: 0, max: 150 },
  { label: 'R$ 150 – R$ 300', min: 150, max: 300 },
  { label: 'R$ 300 – R$ 500', min: 300, max: 500 },
  { label: 'Acima de R$ 500', min: 500, max: '' },
]

const ALL_SIZES = [...SIZES, 'Único']

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="fgroup">
      <button className="fgroup__head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={16} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} style={{ overflow: 'hidden' }}>
            <div className="fgroup__body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Filters({ params, set, counts }) {
  const cats = (params.get('categoria') || '').split(',').filter(Boolean)
  const sizes = (params.get('tamanho') || '').split(',').filter(Boolean)
  const min = params.get('min') || ''
  const max = params.get('max') || ''
  const [minInput, setMinInput] = useState(min)
  const [maxInput, setMaxInput] = useState(max)
  useEffect(() => { setMinInput(min); setMaxInput(max) }, [min, max])

  const toggleList = (key, list, value) => {
    const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
    set({ [key]: next.join(',') })
  }

  return (
    <div className="filters">
      <FilterGroup title="Categoria">
        {CATEGORIES.map((c) => (
          <label key={c.slug} className="check">
            <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => toggleList('categoria', cats, c.slug)} />
            <span className="check__box" />
            <span className="check__label">{c.name}</span>
            <span className="check__count">{counts[c.slug] || 0}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Preço">
        <div className="price-presets">
          {PRICE_RANGES.map((r) => {
            const active = String(r.min) === min && String(r.max) === max
            return (
              <button key={r.label} className={`chip ${active ? 'is-active' : ''}`} onClick={() => set(active ? { min: '', max: '' } : { min: String(r.min), max: String(r.max) })}>
                {r.label}
              </button>
            )
          })}
        </div>
        <form className="price-inputs" onSubmit={(e) => { e.preventDefault(); set({ min: minInput, max: maxInput }) }}>
          <label><span>Mín.</span><input inputMode="numeric" value={minInput} onChange={(e) => setMinInput(e.target.value.replace(/\D/g, ''))} placeholder="0" /></label>
          <span className="price-inputs__sep" />
          <label><span>Máx.</span><input inputMode="numeric" value={maxInput} onChange={(e) => setMaxInput(e.target.value.replace(/\D/g, ''))} placeholder="1500" /></label>
          <button className="btn btn--dark btn--sm" type="submit"><span className="btn__label">OK</span></button>
        </form>
      </FilterGroup>

      <FilterGroup title="Tamanho">
        <div className="size-grid">
          {ALL_SIZES.map((s) => (
            <button key={s} className={`size-btn ${sizes.includes(s) ? 'is-active' : ''}`} onClick={() => toggleList('tamanho', sizes, s)}>
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Destaques" defaultOpen={false}>
        <label className="check">
          <input type="checkbox" checked={params.get('promo') === '1'} onChange={(e) => set({ promo: e.target.checked ? '1' : '' })} />
          <span className="check__box" /><span className="check__label">Em promoção</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={params.get('colecao') === 'blackout'} onChange={(e) => set({ colecao: e.target.checked ? 'blackout' : '' })} />
          <span className="check__box" /><span className="check__label">Coleção Blackout</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={params.get('novos') === '1'} onChange={(e) => set({ novos: e.target.checked ? '1' : '' })} />
          <span className="check__box" /><span className="check__label">Somente lançamentos</span>
        </label>
      </FilterGroup>
    </div>
  )
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const [loading, setLoading] = useState(false)

  const q = params.get('busca') || ''
  const cats = (params.get('categoria') || '').split(',').filter(Boolean)
  const sizes = (params.get('tamanho') || '').split(',').filter(Boolean)
  const min = Number(params.get('min')) || 0
  const max = Number(params.get('max')) || Infinity
  const sort = params.get('ordem') || 'relevancia'
  const colecao = params.get('colecao')
  const promo = params.get('promo') === '1'
  const novos = params.get('novos') === '1'

  const set = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }

  // Pequeno feedback visual ao mudar os filtros
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 260)
    return () => clearTimeout(t)
  }, [params.toString()])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  const base = useMemo(() => (q ? searchProducts(q) : PRODUCTS), [q])

  const results = useMemo(() => {
    let list = base.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s) && !p.sizesOut.includes(s))) return false
      if (p.price < min || p.price > max) return false
      if (colecao && p.collection !== colecao) return false
      if (promo && !p.oldPrice) return false
      if (novos && !p.isNew) return false
      return true
    })
    const sorters = {
      populares: (a, b) => b.sold - a.sold,
      novos: (a, b) => Number(b.isNew) - Number(a.isNew) || b.sold - a.sold,
      menor: (a, b) => a.price - b.price,
      maior: (a, b) => b.price - a.price,
    }
    if (sorters[sort]) list = [...list].sort(sorters[sort])
    return list
  }, [base, cats.join(), sizes.join(), min, max, sort, colecao, promo, novos])

  const counts = useMemo(() => base.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {}), [base])

  const title = q
    ? `Resultados para “${q}”`
    : colecao === 'blackout'
      ? 'Coleção Blackout'
      : promo
        ? 'Sale'
        : cats.length === 1
          ? categoryName(cats[0])
          : sort === 'novos'
            ? 'Lançamentos'
            : 'Todos os produtos'

  const active = [
    ...(q ? [{ label: `Busca: ${q}`, clear: { busca: '' } }] : []),
    ...cats.map((c) => ({ label: categoryName(c), clear: { categoria: cats.filter((x) => x !== c).join(',') } })),
    ...sizes.map((s) => ({ label: `Tam. ${s}`, clear: { tamanho: sizes.filter((x) => x !== s).join(',') } })),
    ...(params.get('min') || params.get('max')
      ? [{ label: `${money(min)} – ${max === Infinity ? '∞' : money(max)}`, clear: { min: '', max: '' } }]
      : []),
    ...(colecao ? [{ label: 'Blackout', clear: { colecao: '' } }] : []),
    ...(promo ? [{ label: 'Em promoção', clear: { promo: '' } }] : []),
    ...(novos ? [{ label: 'Lançamentos', clear: { novos: '' } }] : []),
  ]

  const clearAll = () => setParams(sort !== 'relevancia' ? { ordem: sort } : {}, { replace: true })

  return (
    <Page className="shop">
      <section className="page-hero container">
        <nav className="crumbs"><Link to="/">Início</Link><span>/</span><span>Loja</span></nav>
        <motion.h1 key={title} className="display-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          {title}
        </motion.h1>
        <div className="cat-pills">
          <Link to="/loja" className={`pill ${!cats.length && !colecao && !promo && !q ? 'is-active' : ''}`}>Tudo</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/loja?categoria=${c.slug}`} className={`pill ${cats.length === 1 && cats[0] === c.slug ? 'is-active' : ''}`}>{c.name}</Link>
          ))}
        </div>
      </section>

      <div className="shop__layout container">
        <aside className="shop__side">
          <Filters params={params} set={set} counts={counts} />
        </aside>

        <div className="shop__main">
          <div className="toolbar">
            <button className="btn btn--outline btn--sm toolbar__filter" onClick={() => setDrawer(true)}>
              <span className="btn__label"><SlidersHorizontal size={16} /> Filtros {active.length > 0 && <b className="dot-count">{active.length}</b>}</span>
            </button>
            <span className="toolbar__count">
              <motion.strong key={results.length} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{results.length}</motion.strong> produtos
            </span>
            <label className="select">
              <span>Ordenar:</span>
              <select value={sort} onChange={(e) => set({ ordem: e.target.value === 'relevancia' ? '' : e.target.value })}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
          </div>

          <AnimatePresence>
            {active.length > 0 && (
              <motion.div className="active-filters" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div className="active-filters__inner">
                  <AnimatePresence initial={false}>
                    {active.map((f) => (
                      <motion.button key={f.label} layout className="chip chip--removable" onClick={() => set(f.clear)} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                        {f.label} <X size={12} />
                      </motion.button>
                    ))}
                  </AnimatePresence>
                  <button className="link-under" onClick={clearAll}>Limpar tudo</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`results ${loading ? 'is-loading' : ''}`}>
            {results.length ? (
              <motion.div layout className="grid grid--3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {results.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: Math.min(i, 8) * 0.04 } }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    >
                      <ProductCard product={p} priority={i < 3} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Empty
                icon={SearchX}
                title="Nada por aqui"
                text="Nenhum produto corresponde aos filtros selecionados. Tente ajustar ou limpar os filtros."
                action={<Button variant="dark" onClick={clearAll}>Limpar filtros</Button>}
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="overlay" onClick={() => setDrawer(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="drawer drawer--left" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.5, ease }} role="dialog" aria-label="Filtros">
              <div className="drawer__head">
                <h2>Filtros</h2>
                <button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Fechar filtros"><X size={22} /></button>
              </div>
              <div className="drawer__scroll"><Filters params={params} set={set} counts={counts} /></div>
              <div className="drawer__foot drawer__foot--row">
                <button className="btn btn--outline" onClick={clearAll}><span className="btn__label">Limpar</span></button>
                <button className="btn btn--primary" onClick={() => setDrawer(false)}><span className="btn__fill" /><span className="btn__label">Ver {results.length} produtos</span></button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Page>
  )
}
