import { useEffect, useState } from 'react'
import API from '../api/axios'

const AdminVisits = () => {
  const [visitCount, setVisitCount] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState([])

  const fetchVisitCount = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await API.get('/visit', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVisitCount(res.data.total)
    } catch (err) {
      console.error('Ziyaretçi sayısı alınamadı:', err)
    }
  }

  const fetchOnlineUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await API.get('/users/online', {
        headers: { Authorization: `Bearer ${token}` }
      }) 
      setOnlineUsers(res.data.data)
      console.log('Online kullanıcı:', onlineUsers)
    } catch (err) {
      console.error('Online kullanıcılar alınamadı:', err)
    }
  }

  useEffect(() => {
    fetchVisitCount()
    fetchOnlineUsers()
  }, [])

  return (
    <div>
      <h2>👁️ Ziyaretçi ve Online Kullanıcı Takibi</h2>

      <div style={{ margin: '20px 0', fontSize: '18px' }}>
        <strong>Toplam Ziyaretçi:</strong> {visitCount}
      </div>

      <h3>🟢 Şu An Online Olan Kullanıcılar ({onlineUsers.length})</h3>
      {onlineUsers.length === 0 ? (
        <p>Şu anda online kullanıcı yok.</p>
      ) : (
        <ul>
          {onlineUsers.map((user) => (
            <li key={user._id}>
              <strong>{user?.name}</strong> – {user?.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminVisits
