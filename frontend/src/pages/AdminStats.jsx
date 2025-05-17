import { useEffect, useState } from 'react'
import API from '../api/axios'

const AdminStats = () => {
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await API.get('/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(res.data.data)
    } catch (err) {
      console.error('İstatistikler alınamadı:', err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (!stats) return <p>Yükleniyor...</p>

  return (
    <div>
      <h2>📊 Site İstatistikleri</h2>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={cardStyle}>
          <h3>📝 Toplam Soru</h3>
          <p style={countStyle}>{stats.totalQuestions}</p>
        </div>
        <div style={cardStyle}>
          <h3>💬 Toplam Cevap</h3>
          <p style={countStyle}>{stats.totalAnswers}</p>
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  backgroundColor: '#444',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  width: '200px',
  textAlign: 'center'
}

const countStyle = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: 'white'
}

export default AdminStats
