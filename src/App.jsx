import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'motion/react'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Toasts from './components/Toasts'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Favorites from './pages/Favorites'
import Account from './pages/Account'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Info from './pages/Info'
import NotFound from './pages/NotFound'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

export default function App() {
  const location = useLocation()
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Header />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/loja" element={<Shop />} />
          <Route path="/produto/:slug" element={<Product />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/conta" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido/:id" element={<OrderSuccess />} />
          <Route path="/info/:slug" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <Toasts />
    </MotionConfig>
  )
}
