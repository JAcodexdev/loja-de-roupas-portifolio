import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import Logo from './Logo'
import SearchOverlay from './SearchOverlay'
import { useStore } from '../context/StoreContext'
import { CATEGORIES } from '../data/products'
import Img from './Img'
import { ease } from './Motion'

export const NAV = [
  { to: '/loja', label: 'Loja' },
  { to: '/loja?ordem=novos', label: 'Lançamentos' },
  { to: '/loja?colecao=blackout', label: 'Blackout' },
  { to: '/loja?promo=1', label: 'Sale' },
]

function Counter({ value, pulse }) {
  return (
    <AnimatePresence>
      {value > 0 && (
        <motion.span
          key={pulse}
          className="icon-btn__count"
          initial={{ scale: 0.3 }}
          animate={{ scale: [1.5, 1] }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          {value}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export default function Header() {
  const { cartCount, favorites, setCartOpen, user, cartPulse } = useStore()
  const { pathname, search } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const overHero = pathname === '/' && !scrolled && !menuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname, search])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isActive = (to) => {
    const [p, q] = to.split('?')
    return pathname === p && (q ? search.includes(q) : !search)
  }

  return (
    <>
      <div className="announce" role="region" aria-label="Avisos">
        <div className="announce__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} aria-hidden={k === 1}>
              Frete grátis acima de R$ 399 <i /> Troca grátis em 30 dias <i /> Drop 07 — Blackout já disponível <i /> 6x sem juros <i />
            </span>
          ))}
        </div>
      </div>

      <header className={`header ${overHero ? 'header--clear' : ''} ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'header--menu' : ''}`}>
        <div className="header__inner container">
          <button className="icon-btn header__burger" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={menuOpen ? 'x' : 'm'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <Logo />

          <nav className="header__nav" aria-label="Principal">
            {NAV.map((n) => (
              <NavLink key={n.label} to={n.to} className={() => `nav-link ${isActive(n.to) ? 'is-active' : ''}`}>
                {n.label}
                {isActive(n.to) && <motion.span layoutId="nav-underline" className="nav-link__bar" />}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <button className="icon-btn header__search" onClick={() => setSearchOpen(true)} aria-label="Buscar produtos">
              <Search size={20} strokeWidth={1.8} />
              <span className="header__search-label">Buscar</span>
              <kbd>Ctrl K</kbd>
            </button>
            <Link to="/favoritos" className="icon-btn hide-sm" aria-label="Favoritos">
              <Heart size={20} strokeWidth={1.8} />
              <Counter value={favorites.length} pulse={favorites.length} />
            </Link>
            <Link to="/conta" className="icon-btn hide-sm" aria-label={user ? 'Minha conta' : 'Entrar'}>
              {user ? <span className="avatar">{user.name.charAt(0)}</span> : <User size={20} strokeWidth={1.8} />}
            </Link>
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho (${cartCount} itens)`}>
              <motion.span key={cartPulse} animate={cartPulse ? { rotate: [0, -14, 10, -6, 0] } : {}} transition={{ duration: 0.6 }} style={{ display: 'grid' }}>
                <ShoppingBag size={20} strokeWidth={1.8} />
              </motion.span>
              <Counter value={cartCount} pulse={cartPulse} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}</AnimatePresence>
    </>
  )
}

function MobileMenu({ onClose }) {
  const { user, favorites } = useStore()
  const links = [
    ...NAV,
    { to: '/favoritos', label: `Favoritos (${favorites.length})` },
    { to: '/conta', label: user ? 'Minha conta' : 'Entrar / Cadastrar' },
  ]
  return (
    <motion.div
      className="mmenu"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.6, ease }}
    >
      <motion.nav
        className="mmenu__nav"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
      >
        {links.map((l) => (
          <motion.div key={l.label} variants={{ hidden: { y: 40, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.6, ease } } }}>
            <Link to={l.to} onClick={onClose} className="mmenu__link">{l.label}</Link>
          </motion.div>
        ))}
      </motion.nav>
      <motion.div className="mmenu__cats" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}>
        <span className="eyebrow">Categorias</span>
        <div className="mmenu__cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/loja?categoria=${c.slug}`} onClick={onClose} className="mmenu__cat">
              <Img ids={c.image} alt="" width={300} label={c.name} />
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
