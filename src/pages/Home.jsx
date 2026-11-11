import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import { Button, SectionHead } from '../components/ui'
import { Page, Reveal, SplitLines, Stagger, StaggerItem, ease } from '../components/Motion'
import { CATEGORIES, LOOKS, PRODUCTS, getProduct } from '../data/products'
import { money } from '../lib/utils'

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const featured = getProduct('bomber-night-shift')

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero__media" style={{ y }}>
        <motion.div
          className="hero__media-inner"
          style={{ scale }}
          initial={{ clipPath: 'inset(12% 8% 12% 8%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.4, ease }}
        >
          <Img ids={[LOOKS.hero, LOOKS.heroAlt]} alt="Modelo vestindo jaqueta da coleção ASFALTO" width={2000} eager />
        </motion.div>
        <div className="hero__shade" />
      </motion.div>

      <motion.div className="hero__content container" style={{ opacity: fade }}>
        <motion.span className="eyebrow eyebrow--light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          Drop 07 · Outono/Inverno 26
        </motion.span>
        <SplitLines as="h1" className="display hero__title" lines={['Feito', 'pra rua.']} delay={0.35} />
        <motion.p className="hero__text" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease }}>
          Peças pesadas, cortes amplos e tiragens curtas. Desenhado em São Paulo para o concreto, a madrugada e o rolê.
        </motion.p>
        <motion.div className="hero__ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.8, ease }}>
          <Button to="/loja" variant="accent" size="lg" iconRight={ArrowRight}>Comprar agora</Button>
          <Button to="/loja?colecao=blackout" variant="ghost-light" size="lg">Coleção Blackout</Button>
        </motion.div>
      </motion.div>

      {featured && (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.8, ease }} className="hero__tag-wrap">
          <Link to={`/produto/${featured.slug}`} className="hero__tag">
            <span className="hero__tag-dot" />
            <div>
              <span>Na foto</span>
              <strong>{featured.name}</strong>
              <em>{money(featured.price)}</em>
            </div>
            <ArrowUpRight size={18} />
          </Link>
        </motion.div>
      )}

      <motion.a href="#lancamentos" className="hero__scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} aria-label="Rolar para lançamentos">
        <span>Role</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}><ArrowDown size={16} /></motion.span>
      </motion.a>
    </section>
  )
}

function Marquee({ items, variant = 'accent' }) {
  const row = items.map((t, i) => (
    <span key={i}>{t}<i aria-hidden /></span>
  ))
  return (
    <div className={`marquee marquee--${variant}`} aria-label={items.join(', ')}>
      <div className="marquee__track" aria-hidden>
        <div>{row}</div>
        <div>{row}</div>
      </div>
    </div>
  )
}

function NewArrivals() {
  const items = PRODUCTS.filter((p) => p.isNew)
  const scroller = useRef(null)
  const scroll = (dir) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <section className="section container" id="lancamentos">
      <SectionHead
        eyebrow="Recém-chegados"
        title="Lançamentos"
        action={
          <div className="section-head__actions">
            <button className="round-btn" onClick={() => scroll(-1)} aria-label="Anterior"><ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /></button>
            <button className="round-btn" onClick={() => scroll(1)} aria-label="Próximo"><ArrowRight size={18} /></button>
            <Link to="/loja?ordem=novos" className="link-arrow">Ver tudo <ArrowRight size={16} /></Link>
          </div>
        }
      />
      <Stagger className="rail" gap={0.08}>
        <div className="rail__scroll" ref={scroller}>
          {items.map((p, i) => (
            <StaggerItem key={p.id} className="rail__item">
              <ProductCard product={p} priority={i < 2} />
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  )
}

function Categories() {
  return (
    <section className="section container">
      <SectionHead eyebrow="Navegue por" title="Categorias" />
      <Stagger className="cats" gap={0.07}>
        {CATEGORIES.map((c, i) => (
          <StaggerItem key={c.slug} className={`cat cat--${i}`}>
            <Link to={`/loja?categoria=${c.slug}`} className="cat__link">
              <Img ids={c.image} alt={c.name} width={i === 0 ? 1200 : 800} />
              <div className="cat__info">
                <span className="cat__index">0{i + 1}</span>
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
              </div>
              <span className="cat__arrow"><ArrowUpRight size={20} /></span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

function BestSellers() {
  const [tab, setTab] = useState('todos')
  const tabs = [{ slug: 'todos', name: 'Todos' }, ...CATEGORIES]
  const items = useMemo(
    () => [...PRODUCTS].filter((p) => tab === 'todos' || p.category === tab).sort((a, b) => b.sold - a.sold).slice(0, 8),
    [tab]
  )
  return (
    <section className="section container">
      <SectionHead
        eyebrow="O que a rua está vestindo"
        title="Mais vendidos"
        action={<Link to="/loja?ordem=populares" className="link-arrow">Ver ranking <ArrowRight size={16} /></Link>}
      />
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.slug} role="tab" aria-selected={tab === t.slug} className={`tab ${tab === t.slug ? 'is-active' : ''}`} onClick={() => setTab(t.slug)}>
            {tab === t.slug && <motion.span layoutId="best-tab" className="tab__bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span>{t.name}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="grid grid--4">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: i * 0.04 } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              className="rank-wrap"
            >
              <span className="rank">#{i + 1}</span>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

function useCountdown(target) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, target - now)
  return {
    d: Math.floor(diff / 864e5),
    h: Math.floor((diff / 36e5) % 24),
    m: Math.floor((diff / 6e4) % 60),
    s: Math.floor((diff / 1e3) % 60),
  }
}

function PromoBanner() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  // Promo termina sempre no fim do mês corrente
  const [target] = useState(() => {
    const n = new Date()
    return new Date(n.getFullYear(), n.getMonth() + 1, 1).getTime()
  })
  const t = useCountdown(target)
  return (
    <section className="promo" ref={ref}>
      <motion.div className="promo__media" style={{ y }}>
        <Img ids={[LOOKS.promo, LOOKS.store]} alt="Pessoa com skate na cabeça em rua da cidade" width={2000} />
      </motion.div>
      <div className="promo__shade" />
      <div className="promo__inner container">
        <Reveal>
          <span className="badge badge--accent">Sale de estação</span>
          <h2 className="display-md">Até 30% off<br />em peças selecionadas.</h2>
          <p>Jaquetas, moletons e acessórios com preço de virada de estação. Enquanto durar o estoque.</p>
        </Reveal>
        <Reveal delay={0.1} className="promo__right">
          <div className="countdown" aria-label="Tempo restante da promoção">
            {[['d', 'dias'], ['h', 'horas'], ['m', 'min'], ['s', 'seg']].map(([k, l]) => (
              <div key={k} className="countdown__cell">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.strong key={t[k]} initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }} transition={{ duration: 0.3 }}>
                    {String(t[k]).padStart(2, '0')}
                  </motion.strong>
                </AnimatePresence>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <Button to="/loja?promo=1" variant="accent" size="lg" iconRight={ArrowRight}>Ver ofertas</Button>
        </Reveal>
      </div>
    </section>
  )
}

function Blackout() {
  const items = PRODUCTS.filter((p) => p.collection === 'blackout').slice(0, 4)
  return (
    <section className="blackout">
      <div className="container">
        <div className="blackout__top">
          <Reveal className="blackout__media">
            <Img ids={[LOOKS.blackout, LOOKS.blackout2]} alt="Modelo vestindo look preto total da coleção Blackout" width={1400} />
            <span className="blackout__stamp">Edição limitada · 300 peças</span>
          </Reveal>
          <div className="blackout__text">
            <Reveal>
              <span className="eyebrow eyebrow--accent">Coleção exclusiva</span>
              <h2 className="display-lg">BLACK<br />OUT</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Uma cápsula monocromática pensada para a cidade depois das 22h. Tecidos foscos, detalhes refletivos e
                bordados tom sobre tom. Cada peça é numerada e não será reproduzida.
              </p>
              <ul className="blackout__facts">
                <li><strong>06</strong><span>peças</span></li>
                <li><strong>300</strong><span>unidades</span></li>
                <li><strong>01</strong><span>tiragem</span></li>
              </ul>
              <Button to="/loja?colecao=blackout" variant="light" iconRight={ArrowRight}>Explorar a coleção</Button>
            </Reveal>
            <Reveal delay={0.2} className="blackout__secondary">
              <Img ids={[LOOKS.blackout3, LOOKS.blackout2]} alt="Detalhe da coleção Blackout" width={800} />
            </Reveal>
          </div>
        </div>
        <Stagger className="grid grid--4 blackout__grid">
          {items.map((p) => (
            <StaggerItem key={p.id}><ProductCard product={p} /></StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function Manifesto() {
  return (
    <section className="manifesto container">
      <Reveal>
        <p className="manifesto__text">
          A gente não faz roupa pra vitrine. Faz pra <em>pegar chuva no ponto</em>, atravessar a Paulista de madrugada e
          ainda estar inteira <em>daqui a dez anos.</em>
        </p>
      </Reveal>
      <Stagger className="manifesto__stats">
        {[['480g', 'felpa dos moletons'], ['100%', 'produzido em SP'], ['30 dias', 'para trocar grátis'], ['4,8/5', 'avaliação média']].map(([n, l]) => (
          <StaggerItem key={l} className="stat"><strong>{n}</strong><span>{l}</span></StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export default function Home() {
  return (
    <Page className="home">
      <Hero />
      <Marquee items={['Drop 07 — Blackout', 'Frete grátis acima de R$ 399', 'Feito em São Paulo', 'Tiragem limitada', '6x sem juros']} />
      <NewArrivals />
      <Categories />
      <BestSellers />
      <PromoBanner />
      <Manifesto />
      <Blackout />
      <Newsletter />
    </Page>
  )
}
