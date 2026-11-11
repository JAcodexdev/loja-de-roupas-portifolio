import { Link } from 'react-router-dom'
import { CreditCard, QrCode, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import Logo from './Logo'
import { CATEGORIES } from '../data/products'

const Social = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.6 3c.4 2.2 1.8 3.6 4 3.8v3.1c-1.5.1-2.8-.3-4-1.1v6.4c0 3.6-2.9 5.8-6 5.8-3.3 0-5.6-2.6-5.6-5.6 0-3.4 3-6 6.7-5.4v3.2c-1.6-.4-3.3.6-3.3 2.2 0 1.3 1 2.3 2.3 2.3 1.4 0 2.6-.9 2.6-2.8V3h3.3z" /></svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" /></svg>
  ),
  Pinterest: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.6-1.8-4.3-4.5-4.3-3 0-4.8 2.3-4.8 4.6 0 .9.4 1.9.8 2.4l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.4-.6-2.2-2.6-2.2-4.2 0-3.4 2.5-6.6 7.2-6.6 3.8 0 6.7 2.7 6.7 6.3 0 3.7-2.4 6.8-5.6 6.8-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2 1-.9 2.2-1.4 2.9A10 10 0 1 0 12 2z" /></svg>
  ),
}

const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com/' },
  { name: 'TikTok', href: 'https://www.tiktok.com/' },
  { name: 'YouTube', href: 'https://www.youtube.com/' },
  { name: 'Pinterest', href: 'https://www.pinterest.com/' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="perks container">
        {[
          { icon: Truck, t: 'Frete grátis', d: 'Em compras acima de R$ 399' },
          { icon: RotateCcw, t: 'Troca fácil', d: '30 dias para trocar sem custo' },
          { icon: ShieldCheck, t: 'Compra segura', d: 'Ambiente protegido' },
          { icon: CreditCard, t: '6x sem juros', d: 'Ou 5% off no Pix' },
        ].map(({ icon: Icon, t, d }) => (
          <div className="perk" key={t}>
            <Icon size={22} strokeWidth={1.5} />
            <div><strong>{t}</strong><span>{d}</span></div>
          </div>
        ))}
      </div>

      <div className="footer__main container">
        <div className="footer__brand">
          <Logo />
          <p>Streetwear desenhado e produzido em São Paulo. Peças pesadas, cortes amplos e tiragens curtas — feitas para durar mais que a tendência.</p>
          <div className="footer__social">
            {SOCIAL_LINKS.map((s) => {
              const Icon = Social[s.name]
              return (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} className="social-btn">
                  <Icon />
                </a>
              )
            })}
          </div>
        </div>

        <div className="footer__col">
          <h4>Loja</h4>
          {CATEGORIES.map((c) => <Link key={c.slug} to={`/loja?categoria=${c.slug}`}>{c.name}</Link>)}
          <Link to="/loja?ordem=novos">Lançamentos</Link>
        </div>
        <div className="footer__col">
          <h4>Ajuda</h4>
          <Link to="/info/faq">Perguntas frequentes</Link>
          <Link to="/info/envio">Envio e prazos</Link>
          <Link to="/info/trocas">Trocas e devoluções</Link>
          <Link to="/info/medidas">Guia de medidas</Link>
          <Link to="/info/contato">Contato</Link>
        </div>
        <div className="footer__col">
          <h4>Marca</h4>
          <Link to="/info/sobre">Sobre a ASFALTO</Link>
          <Link to="/info/lojas">Nossa loja física</Link>
          <Link to="/loja?colecao=blackout">Coleção Blackout</Link>
          <Link to="/conta">Minha conta</Link>
          <Link to="/favoritos">Favoritos</Link>
        </div>
      </div>

      <div className="footer__giant" aria-hidden>ASFALTO</div>

      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} ASFALTO Streetwear. Loja de demonstração — nenhuma compra é processada.</span>
        <div className="footer__pay">
          <span className="pay-tag"><QrCode size={14} /> Pix</span>
          <span className="pay-tag"><CreditCard size={14} /> Crédito</span>
          <Link to="/info/termos">Termos</Link>
          <Link to="/info/privacidade">Privacidade</Link>
        </div>
      </div>
    </footer>
  )
}
