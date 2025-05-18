import { useEffect, useState } from 'react'
import API from '../api/axios'

const PublicAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await API.get('/announcements')
        setAnnouncements(res.data.data)
      } catch (err) {
        console.error('Duyurular alınamadı:', err)
      }
    }

    fetchAnnouncements()
  }, [])

  return (
    <div>
      <h2>📢 Duyurular</h2>
      {announcements.length === 0 ? (
        <p>Henüz duyuru bulunmuyor.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {announcements.map((a) => (
            <div
              key={a._id}
              style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}
            >
              {a.imageUrl && (
                <img
                  src={`http://localhost:5000${a.imageUrl}`}
                  alt="duyuru"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '10px' }}
                />
              )}
              <h3>{a.title}</h3>
              <p>{a.content}</p>
              <small>
                {a.createdBy?.name || 'Bilinmiyor'} – {new Date(a.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PublicAnnouncements
