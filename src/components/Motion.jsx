import { motion } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1]

/** Revela o conteúdo ao entrar na viewport. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div', once = true, amount = 0.25 }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </Tag>
  )
}

/** Container que escalona a entrada dos filhos <StaggerItem>. */
export function Stagger({ children, className, gap = 0.08, amount = 0.15 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

export const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}

/** Título com linhas que sobem de dentro de uma máscara. */
export function SplitLines({ lines, className, delay = 0, as = 'h1' }) {
  const Tag = as
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            className="line"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1, ease, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Transição de página. */
export function Page({ children, className = '' }) {
  return (
    <motion.main
      className={`page ${className}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.main>
  )
}
