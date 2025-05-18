import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import API from '../api/axios'
import { UserContext } from '../context/UserContext'

const AddQuestion = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      return alert('Başlık ve içerik boş olamaz.')
    }

    const token = localStorage.getItem('token')

    try {
      const csrfRes = await API.get('/csrf-token', { withCredentials: true })
      const csrfToken = csrfRes.data.csrfToken

      await API.post(
        '/questions',
        {
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'CSRF-Token': csrfToken
          },
          withCredentials: true
        }
      )

      navigate('/questions')
    } catch (err) {
      console.error('Soru eklenemedi:', err)
      alert('Soru eklenirken hata oluştu.')
    }
  }

  return (
    <div>
      <h2>Yeni Soru Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Başlık:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <div>
          <label>İçerik:</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            style={{ height: '200px', marginBottom: '10px' }}
          />
        </div>

        <div>
          <label>Etiketler (virgülle ayır):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <button type="submit">Soruyu Gönder</button>
      </form>
    </div>
  )
}

export default AddQuestion
