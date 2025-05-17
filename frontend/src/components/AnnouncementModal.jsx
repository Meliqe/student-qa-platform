import { useState, useEffect } from 'react'

const AnnouncementModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setContent(initialData.content || '')
    } else {
      setTitle('')
      setContent('')
    }
  }, [initialData])

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('Başlık ve içerik boş olamaz.')
      return
    }
    onSave({ title, content, _id: initialData?._id })
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h3>{initialData ? 'Duyuruyu Güncelle' : 'Yeni Duyuru Ekle'}</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Başlık"
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="İçerik"
          rows={5}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} style={{ marginRight: '10px' }}>İptal</button>
          <button onClick={handleSubmit}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementModal
