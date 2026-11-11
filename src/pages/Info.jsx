import { useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Mail, MapPin, Send } from 'lucide-react'
import Img from '../components/Img'
import { Button, Field } from '../components/ui'
import { Page, ease } from '../components/Motion'
import { useStore } from '../context/StoreContext'
import { LOOKS } from '../data/products'
import { isEmail, wait } from '../lib/utils'
import NotFound from './NotFound'

const FAQ = [
  ['Qual o prazo de entrega?', 'Postamos em até 1 dia útil. O envio padrão leva de 5 a 8 dias úteis e o expresso de 1 a 3 dias úteis para capitais do Sudeste.'],
  ['Como escolho o tamanho?', 'Nossa modelagem é ampla. Se prefere um caimento mais justo, desça um número. Consulte o guia de medidas com as dimensões de cada peça.'],
  ['Posso trocar uma peça?', 'Sim. A primeira troca é grátis em até 30 dias após o recebimento, desde que a peça esteja sem uso e com etiqueta.'],
  ['Quais formas de pagamento?', 'Cartão de crédito em até 6x sem juros e Pix com 5% de desconto. (Nesta demonstração nenhuma cobrança é feita.)'],
  ['Os drops voltam ao estoque?', 'Peças da linha permanente são repostas. Coleções numeradas, como a Blackout, têm tiragem única.'],
]

const SIZE_TABLE = [
  ['P', '54', '70', '58'],
  ['M', '57', '72', '60'],
  ['G', '60', '74', '62'],
  ['GG', '63', '76', '64'],
  ['XGG', '66', '78', '66'],
]

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="accordion">
      {FAQ.map(([q, a], i) => (
        <div className="accordion__item" key={q}>
          <button className="accordion__head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {q}<motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} style={{ overflow: 'hidden' }}>
                <div className="accordion__body"><p>{a}</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function Contact() {
  const { notify } = useStore()
  const [f, setF] = useState({ name: '', email: '', msg: '' })
  const [err, setErr] = useState({})
  const [sending, setSending] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Informe seu nome.'
    if (!isEmail(f.email)) er.email = 'E-mail inválido.'
    if (f.msg.trim().length < 10) er.msg = 'Escreva pelo menos 10 caracteres.'
    setErr(er)
    if (Object.keys(er).length) return
    setSending(true)
    await wait(900)
    setSending(false)
    setF({ name: '', email: '', msg: '' })
    notify('Mensagem enviada! Respondemos em até 1 dia útil.')
  }
  return (
    <>
      <p>Atendimento de segunda a sexta, das 9h às 18h. Respondemos todas as mensagens em até 1 dia útil.</p>
      <p className="row-icon"><Mail size={16} /> atendimento@asfalto.example</p>
      <form className="form" onSubmit={submit} noValidate>
        <div className="form-grid">
          <Field label="Nome" error={err.name}><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="E-mail" error={err.email}><input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        </div>
        <Field label="Mensagem" error={err.msg}><textarea rows={5} value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} /></Field>
        <Button type="submit" loading={sending} icon={Send} variant="dark">Enviar mensagem</Button>
      </form>
    </>
  )
}

const PAGES = {
  sobre: {
    title: 'Sobre a ASFALTO',
    body: () => (
      <>
        <p className="lead">A ASFALTO nasceu em 2019 numa garagem na Barra Funda, com uma máquina de silk e uma ideia: roupa urbana brasileira com qualidade de exportação.</p>
        <p>Desenhamos e produzimos tudo em São Paulo, em parceria com oficinas de costura do Bom Retiro e do Brás. Trabalhamos com tiragens curtas para evitar sobras e com tecidos pesados que aguentam o dia a dia da cidade.</p>
        <p>Cada drop é uma conversa com a rua: os sinais de trânsito, as fachadas de concreto, os pixos, a madrugada. A gente traduz isso em peças simples, bem cortadas e feitas para durar.</p>
        <div className="info__img"><Img ids={[LOOKS.store, LOOKS.hero]} alt="Fachada da loja" width={1400} /></div>
      </>
    ),
  },
  envio: {
    title: 'Envio e prazos',
    body: () => (
      <>
        <p>Enviamos para todo o Brasil. Os pedidos são postados em até 1 dia útil após a confirmação do pagamento.</p>
        <ul className="bullets">
          <li><strong>Padrão:</strong> 5 a 8 dias úteis — R$ 24,90 (grátis acima de R$ 399)</li>
          <li><strong>Expresso:</strong> 1 a 3 dias úteis — R$ 39,90</li>
          <li><strong>Retirada na loja:</strong> em breve</li>
        </ul>
        <p>Você recebe o código de rastreio por e-mail assim que o pedido sai do nosso estoque.</p>
      </>
    ),
  },
  trocas: {
    title: 'Trocas e devoluções',
    body: () => (
      <>
        <p>Você tem 30 dias corridos após o recebimento para solicitar troca ou devolução. A primeira troca de cada pedido é gratuita.</p>
        <ul className="bullets">
          <li>A peça deve estar sem uso, sem lavagem e com a etiqueta.</li>
          <li>Solicite pela área “Minha conta”, na aba de pedidos, ou pelo nosso contato.</li>
          <li>Reembolsos são feitos na mesma forma de pagamento em até 10 dias úteis.</li>
        </ul>
      </>
    ),
  },
  medidas: {
    title: 'Guia de medidas',
    body: () => (
      <>
        <p>Medidas das camisetas e moletons em centímetros, com a peça estendida sobre uma superfície plana. Nossa modelagem é oversized: na dúvida, use seu tamanho habitual.</p>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Tamanho</th><th>Largura</th><th>Comprimento</th><th>Manga</th></tr></thead>
            <tbody>{SIZE_TABLE.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p className="muted">Calças: P (38–40), M (40–42), G (42–44), GG (44–46).</p>
      </>
    ),
  },
  faq: { title: 'Perguntas frequentes', body: Faq },
  contato: { title: 'Contato', body: Contact },
  lojas: {
    title: 'Nossa loja física',
    body: () => (
      <>
        <p className="row-icon"><MapPin size={16} /> Rua Fictícia do Concreto, 707 — Barra Funda, São Paulo/SP</p>
        <p>Terça a sábado, das 11h às 20h. Domingo, das 12h às 18h. Lançamentos sempre às sextas, às 19h, com DJ convidado.</p>
        <div className="info__img"><Img ids={[LOOKS.store, LOOKS.newsletter]} alt="Loja ASFALTO" width={1400} /></div>
      </>
    ),
  },
  termos: {
    title: 'Termos de uso',
    body: () => (
      <>
        <p>Este site é uma loja de demonstração criada para fins de apresentação. Nenhum produto é vendido, nenhum pagamento é processado e nenhum dado é enviado a servidores.</p>
        <p>As fotografias são de bancos de imagem de uso livre (Unsplash) e pertencem aos seus respectivos autores.</p>
      </>
    ),
  },
  privacidade: {
    title: 'Política de privacidade',
    body: () => (
      <>
        <p>Todas as informações que você digitar (cadastro, endereço, pedidos, carrinho e favoritos) ficam salvas apenas no armazenamento local (localStorage) do seu navegador.</p>
        <p>Para apagar tudo, limpe os dados do site nas configurações do navegador.</p>
      </>
    ),
  },
}

const MENU = ['sobre', 'faq', 'envio', 'trocas', 'medidas', 'contato', 'lojas', 'termos', 'privacidade']

export default function Info() {
  const { slug } = useParams()
  const page = PAGES[slug]
  if (!page) return <NotFound />
  const Body = page.body
  return (
    <Page className="info container">
      <nav className="crumbs"><Link to="/">Início</Link><span>/</span><span>{page.title}</span></nav>
      <div className="info__layout">
        <aside className="info__nav">
          {MENU.map((k) => <NavLink key={k} to={`/info/${k}`}>{PAGES[k].title}</NavLink>)}
        </aside>
        <motion.article key={slug} className="info__body" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
          <h1 className="display-md">{page.title}</h1>
          <Body />
        </motion.article>
      </div>
    </Page>
  )
}
