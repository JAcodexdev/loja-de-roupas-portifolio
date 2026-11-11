import { useState } from 'react'
import { img } from '../data/products'

function ImgContent({ list, alt, width, className, eager, label }) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const failed = index >= list.length

  const handleError = () => {
    setLoaded(false)
    setIndex((current) => current + 1)
  }

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
          onError={handleError}
        />
      )}
    </div>
  )
}

export default function Img({
  ids,
  alt,
  width = 1200,
  className = '',
  eager = false,
  label,
}) {
  const list = (Array.isArray(ids) ? ids : [ids]).filter(Boolean)

  return (
    <ImgContent
      key={JSON.stringify(list)}
      list={list}
      alt={alt}
      width={width}
      className={className}
      eager={eager}
      label={label}
    />
  )
}
