import { Link } from 'react-router-dom'

export default function Logo({ onClick }) {
  return (
    <Link to="/" className="logo" onClick={onClick} aria-label="ASFALTO — página inicial">
      <span className="logo__word">ASFALTO</span>
      <span className="logo__dot" aria-hidden />
    </Link>
  )
}
