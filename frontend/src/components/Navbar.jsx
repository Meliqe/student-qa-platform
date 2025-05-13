import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Anasayfa</Link>
      <Link to="/login" style={{ marginRight: '10px' }}>Giriş Yap</Link>
      <Link to="/register">Kayıt Ol</Link>
    </nav>
  )
}

export default Navbar
