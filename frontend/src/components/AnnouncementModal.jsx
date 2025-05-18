import { useState, useEffect } from 'react'

const AnnouncementModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '')
        setContent(initialData.content || '')
        setPreview(initialData.imageUrl || null)
      } else {
        setTitle('')
        setContent('')
        setPreview(null)
      }
      setImage(null)
    }
  }, [isOpen]) // ✅ Modal her açıldığında tetiklenir

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('Başlık ve içerik boş olamaz.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    if (image) {
      formData.append('image', image)
    }
    if (initialData?._id) {
      formData.append('_id', initialData._id)
    }

    onSave(formData, initialData?._id)
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
          rows={4}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <div style={{ marginTop: '10px' }}>
            <img src={preview} alt="Önizleme" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button onClick={onClose} style={{ marginRight: '10px' }}>İptal</button>
          <button onClick={handleSubmit}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementModal
