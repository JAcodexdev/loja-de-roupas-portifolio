import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui'
import { Page, SplitLines } from '../components/Motion'

export default function NotFound() {
  return (
    <Page className="notfound container">
      <span className="eyebrow">Erro 404</span>
      <SplitLines as="h1" className="display" lines={['Rua sem', 'saída.']} />
      <p className="muted">A página que você procura não existe ou foi movida.</p>
      <div className="row-gap">
        <Button to="/" variant="dark">Voltar ao início</Button>
        <Button to="/loja" variant="outline" iconRight={ArrowRight}>Ver produtos</Button>
      </div>
    </Page>
  )
}
