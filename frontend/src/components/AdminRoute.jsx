import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext)
  if (loading) {
    return <div>Yükleniyor...</div> 
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
