import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getById } from '../data/products'
import { hash, load, save, wait } from '../lib/utils'

const StoreContext = createContext(null)

const KEYS = {
  cart: 'asfalto:cart',
  favs: 'asfalto:favorites',
  users: 'asfalto:users',
  session: 'asfalto:session',
}

// Conta de demonstração pronta para testar login e histórico de pedidos.
const DEMO_EMAIL = 'demo@asfalto.com'
const seedUsers = () => ({
  [DEMO_EMAIL]: {
    name: 'Rafa Moreira',
    email: DEMO_EMAIL,
    phone: '(11) 98765-4321',
    password: hash('asfalto123'),
    address: { cep: '01310-100', street: 'Avenida Paulista', number: '1000', complement: 'Apto 42', district: 'Bela Vista', city: 'São Paulo', state: 'SP' },
    createdAt: '2025-08-02T12:00:00.000Z',
    orders: [
      {
        id: 'ASF-48213',
        date: '2026-09-18T15:20:00.000Z',
        status: 'Entregue',
        items: [
          { id: 'p10', name: 'Moletom Hood Fog', image: '1556821840-3a63f95609a7', size: 'G', color: 'cinza', qty: 1, price: 399.9 },
          { id: 'p19', name: 'Boné Six Panel', image: '1588850561407-ed78c282e89b', size: 'Único', color: 'preto', qty: 1, price: 139.9 },
        ],
        subtotal: 539.8, shipping: 0, total: 539.8, payment: 'Pix', shippingMethod: 'Padrão',
      },
    ],
  },
})

let toastId = 0

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load(KEYS.cart, []))
  const [favorites, setFavorites] = useState(() => load(KEYS.favs, []))
  const [users, setUsers] = useState(() => ({ ...seedUsers(), ...load(KEYS.users, {}) }))
  const [session, setSession] = useState(() => load(KEYS.session, null))
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [cartPulse, setCartPulse] = useState(0)

  useEffect(() => { save(KEYS.cart, cart) }, [cart])
  useEffect(() => { save(KEYS.favs, favorites) }, [favorites])
  useEffect(() => { save(KEYS.users, users) }, [users])
  useEffect(() => { save(KEYS.session, session) }, [session])

  // Sincroniza entre abas abertas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEYS.cart) setCart(load(KEYS.cart, []))
      if (e.key === KEYS.favs) setFavorites(load(KEYS.favs, []))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const notify = useCallback((message, type = 'success') => {
    const id = ++toastId
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  // ---------- Carrinho ----------
  const addToCart = useCallback((product, { size, color, qty = 1 }) => {
    const key = `${product.id}-${size}-${color}`
    setCart((c) => {
      const found = c.find((i) => i.key === key)
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
      return [...c, { key, id: product.id, size, color, qty }]
    })
    setCartPulse((n) => n + 1)
  }, [])

  const updateQty = useCallback((key, qty) => {
    setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty: Math.min(10, qty) } : i))))
  }, [])

  const removeFromCart = useCallback((key) => setCart((c) => c.filter((i) => i.key !== key)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const cartItems = useMemo(
    () => cart.map((i) => ({ ...i, product: getById(i.id) })).filter((i) => i.product),
    [cart]
  )
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0)

  // ---------- Favoritos ----------
  const toggleFavorite = useCallback(
    (product) => {
      const has = favorites.includes(product.id)
      setFavorites((f) => (has ? f.filter((x) => x !== product.id) : f.includes(product.id) ? f : [...f, product.id]))
      notify(has ? `${product.name} removido dos favoritos` : `${product.name} salvo nos favoritos`, has ? 'info' : 'success')
    },
    [favorites, notify]
  )
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  // ---------- Conta ----------
  const user = session ? users[session] || null : null

  const register = async ({ name, email, password }) => {
    await wait(700)
    const key = email.trim().toLowerCase()
    if (users[key]) throw new Error('Já existe uma conta com este e-mail.')
    const novo = { name: name.trim(), email: key, phone: '', password: hash(password), address: null, createdAt: new Date().toISOString(), orders: [] }
    setUsers((u) => ({ ...u, [key]: novo }))
    setSession(key)
    return novo
  }

  const login = async (email, password) => {
    await wait(700)
    const key = email.trim().toLowerCase()
    const found = users[key]
    if (!found || found.password !== hash(password)) throw new Error('E-mail ou senha incorretos.')
    setSession(key)
    return found
  }

  const logout = () => {
    setSession(null)
    notify('Você saiu da sua conta', 'info')
  }

  const updateProfile = async (data) => {
    await wait(600)
    setUsers((u) => ({ ...u, [session]: { ...u[session], ...data } }))
  }

  const changePassword = async (current, next) => {
    await wait(600)
    if (users[session].password !== hash(current)) throw new Error('Senha atual incorreta.')
    setUsers((u) => ({ ...u, [session]: { ...u[session], password: hash(next) } }))
  }

  const placeOrder = async ({ address, payment, shippingMethod, shipping, saveAddress, discount = 0 }) => {
    await wait(1600)
    const order = {
      id: 'ASF-' + Math.floor(10000 + Math.random() * 89999),
      date: new Date().toISOString(),
      status: 'Em separação',
      items: cartItems.map((i) => ({
        id: i.id, name: i.product.name, image: i.product.images[0], size: i.size, color: i.color, qty: i.qty, price: i.product.price,
      })),
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping,
      payment,
      shippingMethod,
      address,
    }
    setUsers((u) => ({
      ...u,
      [session]: { ...u[session], orders: [order, ...u[session].orders], address: saveAddress ? address : u[session].address },
    }))
    setCart([])
    return order
  }

  const value = {
    cart: cartItems, cartCount, subtotal, addToCart, updateQty, removeFromCart, clearCart,
    cartOpen, setCartOpen, cartPulse,
    favorites, toggleFavorite, isFavorite,
    user, register, login, logout, updateProfile, changePassword, placeOrder,
    toasts, notify, dismissToast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
