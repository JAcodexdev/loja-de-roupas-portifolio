import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { LoaderCircle, Minus, Plus } from 'lucide-react'
import { COLORS } from '../data/products'

const MLink = motion.create(Link)

/** Botão com microinteração (hover/tap) e estado de carregamento. */
export function Button({ children, variant = 'primary', size, loading, to, href, className = '', icon: Icon, iconRight: IconRight, disabled, ...props }) {
  const cls = `btn btn--${variant} ${size ? `btn--${size}` : ''} ${loading ? 'is-loading' : ''} ${className}`
  const inner = (
    <>
      <span className="btn__fill" aria-hidden />
      <span className="btn__label">
        {loading ? <LoaderCircle className="spin" size={18} /> : Icon && <Icon size={18} strokeWidth={1.8} />}
        {children}
        {!loading && IconRight && <IconRight size={18} strokeWidth={1.8} className="btn__arrow" />}
      </span>
    </>
  )
  const motionProps = { whileTap: { scale: 0.97 } }
  if (to) {
    return <MLink to={to} className={cls} {...motionProps} {...props}>{inner}</MLink>
  }
  if (href) return <motion.a href={href} className={cls} {...motionProps} {...props}>{inner}</motion.a>
  return (
    <motion.button className={cls} {...motionProps} {...props} disabled={loading || disabled}>
      {inner}
    </motion.button>
  )
}

export function QtyPicker({ value, onChange, min = 1, max = 10, small }) {
  return (
    <div className={`qty ${small ? 'qty--sm' : ''}`}>
      <button type="button" aria-label="Diminuir quantidade" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
        <Minus size={14} />
      </button>
      <motion.span key={value} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="qty__value" aria-live="polite">
        {value}
      </motion.span>
      <button type="button" aria-label="Aumentar quantidade" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
        <Plus size={14} />
      </button>
    </div>
  )
}

export function ColorDot({ color, size = 14 }) {
  const c = COLORS[color]
  return <span className="color-dot" style={{ width: size, height: size, background: c?.hex }} title={c?.name} />
}

export function SectionHead({ eyebrow, title, action, children }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="h2">{title}</h2>
        {children}
      </div>
      {action}
    </div>
  )
}

export function Field({ label, error, children, hint }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {error ? <span className="field__error">{error}</span> : hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  )
}

export function Empty({ icon: Icon, title, text, action }) {
  return (
    <motion.div className="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <span className="empty__icon"><Icon size={28} strokeWidth={1.4} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </motion.div>
  )
}
