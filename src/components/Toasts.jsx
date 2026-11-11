import { AnimatePresence, motion } from 'motion/react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'

const ICONS = { success: CircleCheck, error: CircleAlert, info: Info }

export default function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info
          return (
            <motion.div
              key={t.id}
              layout
              className={`toast toast--${t.type}`}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            >
              <Icon size={18} />
              <span>{t.message}</span>
              <button onClick={() => dismissToast(t.id)} aria-label="Fechar aviso"><X size={14} /></button>
              <motion.i className="toast__timer" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 3.2, ease: 'linear' }} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
