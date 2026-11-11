import { useEffect, useState } from 'react'
import { img } from '../data/products'

/**
 * Imagem com skeleton de carregamento e cadeia de fallback:
 * tenta cada id em `ids`; se todos falharem, mostra um painel da marca
 * (nunca uma imagem quebrada).
 */
export default function Img({ ids, alt, width = 1200, className = '', eager = false, label }) {
  const list = Array.isArray(ids) ? ids : [ids]
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setIndex(0)
    setLoaded(false)
  }, [list.join('|')])

  const failed = index >= list.length

  return (
    <div className={`img-wrap ${loaded || failed ? 'is-loaded' : ''} ${className}`}>
      {failed ? (
        <div className="img-fallback" role="img" aria-label={alt}>
          <span className="img-fallback__mark">ASFALTO</span>
          {label && <span className="img-fallback__label">{label}</span>}
        </div>
      ) : (
        <img
          key={list[index]}
          src={img(list[index], width)}
          srcSet={`${img(list[index], Math.round(width / 2))} ${Math.round(width / 2)}w, ${img(list[index], width)} ${width}w`}
          sizes={`(max-width: 700px) 100vw, ${width}px`}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setIndex((i) => i + 1)}
        />
      )}
    </div>
  )
}
