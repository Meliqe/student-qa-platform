import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>🛠️ Admin Kontrol Paneli</h2>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/admin/users')} style={buttonStyle}>👥 Kullanıcıları Yönet</button>
        <button onClick={() => navigate('/admin/stats')} style={buttonStyle}>📊 İstatistikler</button>
        <button onClick={() => navigate('/admin/announcements')} style={buttonStyle}>📢 Duyurular</button>
        <button onClick={() => navigate('/admin/visit')} style={buttonStyle}>👁️ Ziyaretçi Sayacı</button>
      </div>
    </div>
  )
}

const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '6px',
  cursor: 'pointer',
  backgroundColor: '#334155',
  color: 'white',
  border: 'none'
}

export default AdminPanel
