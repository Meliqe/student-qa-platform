import { useEffect, useState } from 'react'
import API from '../api/axios'
import AnnouncementModal from '../components/AnnouncementModal'

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get('/announcements')
      setAnnouncements(res.data.data)
    } catch (err) {
      console.error('Duyurular alınamadı:', err)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const openNewModal = () => {
    setSelectedAnnouncement(null)
    setIsModalOpen(true)
  }

  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement)
    setIsModalOpen(true)
  }

  const handleSave = async (formData, id) => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }

      if (id) {
        await API.put(`/announcements/${id}`, formData, { headers })
      } else {
        await API.post('/announcements', formData, { headers })
      }

      setIsModalOpen(false)
      fetchAnnouncements()
    } catch (err) {
      alert('Kayıt işlemi başarısız.', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu duyuruyu silmek istiyor musunuz?')) return
    try {
      const token = localStorage.getItem('token')
      await API.delete(`/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(prev => prev.filter(a => a._id !== id))
    } catch (err) {
      alert('Silme başarısız.', err)
    }
  }

  return (
    <div>
      <h2>📢 Duyuru Yönetimi</h2>
      <button onClick={openNewModal} style={{ marginBottom: '20px' }}>+ Yeni Duyuru</button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {announcements.map(a => (
          <div key={a._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h4>{a.title}</h4>
            <p>{a.content}</p>
            {a.imageUrl && (
              <img
                src={`http://localhost:5000${a.imageUrl}`}
                alt="duyuru görseli"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  marginBottom: '10px'
                }}
              />
            )}
            <small>Oluşturan: {a.createdBy?.name || 'Bilinmiyor'}</small><br />
            <small>{new Date(a.createdAt).toLocaleString()}</small><br />
            <button onClick={() => openEditModal(a)} style={{ marginRight: '10px' }}>Güncelle</button>
            <button onClick={() => handleDelete(a._id)} style={{ color: 'red' }}>Sil</button>
          </div>
        ))}
      </div>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedAnnouncement}
        onSave={handleSave}
      />
    </div>
  )
}

export default AdminAnnouncements
