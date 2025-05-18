import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import socket from '../socket/index'

const Navbar = () => {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('csrfToken')
    socket.disconnect()
    setUser(null)
    navigate('/')
  }

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '15px' }}>🏠 Anasayfa</Link>
      <Link to="/questions" style={{ marginRight: '15px' }}>❓ Sorular</Link>
      <Link to="/announcements" style={{ marginRight: '15px' }}>📢 Duyurular</Link>

      {user && (
        <Link to="/add-question" style={{ marginRight: '15px' }}>➕ Soru Sor</Link>
      )}

      {user ? (
        <span style={{ float: 'right' }}>
          <Link to="/profile" style={{ marginRight: '10px' }}>👤 Profilim</Link>
          Merhaba, {user.name} |
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
            🚪 Çıkış
          </button>
        </span>
      ) : (
        <span style={{ float: 'right' }}>
          <Link to="/login" style={{ marginRight: '10px' }}>🔐 Giriş Yap</Link>
          <Link to="/register">📝 Kayıt Ol</Link>
        </span>
      )}
    </nav>
  )
}

export default Navbar
