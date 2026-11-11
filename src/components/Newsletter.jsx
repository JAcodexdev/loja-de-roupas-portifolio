import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CircleCheck } from 'lucide-react'
import Img from './Img'
import { Button } from './ui'
import { Reveal } from './Motion'
import { LOOKS } from '../data/products'
import { isEmail, load, save, wait } from '../lib/utils'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState(() => (load('asfalto:newsletter', null) ? 'done' : 'idle'))
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setError('Digite um e-mail válido.')
    setError('')
    setState('loading')
    await wait(900)
    save('asfalto:newsletter', { email, date: new Date().toISOString() })
    setState('done')
  }

  return (
    <section className="newsletter">
      <Img ids={[LOOKS.newsletter, LOOKS.store]} alt="" width={1800} className="newsletter__bg" />
      <div className="newsletter__inner container">
        <Reveal>
          <span className="eyebrow eyebrow--light">Lista ASFALTO</span>
          <h2 className="display-md">Chegue antes<br />no próximo drop.</h2>
          <p>Acesso antecipado aos lançamentos, convites para eventos na loja e 10% off na primeira compra.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            {state === 'done' ? (
              <motion.div key="ok" className="newsletter__ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <CircleCheck size={28} />
                <div>
                  <strong>Você está na lista.</strong>
                  <span>Use o cupom <b>RUA10</b> na sua primeira compra.</span>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} className="newsletter__form" exit={{ opacity: 0, y: -10 }} noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  aria-label="Seu e-mail"
                  aria-invalid={!!error}
                />
                <Button type="submit" loading={state === 'loading'} iconRight={ArrowRight}>Inscrever</Button>
                {error && <span className="newsletter__error">{error}</span>}
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
