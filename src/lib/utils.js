const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export const money = (v) => brl.format(v)

export const installments = (v) => {
  const n = v >= 300 ? 6 : v >= 150 ? 3 : 1
  return n > 1 ? `ou ${n}x de ${money(v / n)} sem juros` : 'à vista no Pix ou cartão'
}

export const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* armazenamento indisponível — segue em memória */
  }
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// Hash simples apenas para não guardar a senha em texto puro na demo.
export const hash = (s) => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return 'h' + (h >>> 0).toString(36)
}

export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())

export const onlyDigits = (s) => s.replace(/\D/g, '')

export const maskCEP = (s) => onlyDigits(s).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
export const maskPhone = (s) => {
  const d = onlyDigits(s).slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
export const maskCard = (s) => onlyDigits(s).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
export const maskExpiry = (s) => onlyDigits(s).slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2')
export const maskCPF = (s) =>
  onlyDigits(s)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export const FREE_SHIPPING = 399
export const SHIPPING = {
  padrao: { id: 'padrao', name: 'Padrão', eta: '5 a 8 dias úteis', price: 24.9 },
  expresso: { id: 'expresso', name: 'Expresso', eta: '1 a 3 dias úteis', price: 39.9 },
}
export const shippingPrice = (method, subtotal) =>
  method === 'padrao' && subtotal >= FREE_SHIPPING ? 0 : SHIPPING[method].price
