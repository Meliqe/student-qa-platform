import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const AdminNavbar = () => {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <nav style={{
      backgroundColor: '#222',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>👤 {user?.name || 'Admin'}</div>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '6px 12px',
          cursor: 'pointer'
        }}
      >
        Çıkış Yap
      </button>
    </nav>
  )
}

export default AdminNavbar
