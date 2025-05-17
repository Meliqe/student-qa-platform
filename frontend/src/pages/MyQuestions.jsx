import { useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import API from '../api/axios'
import { Link } from 'react-router-dom'

const MyQuestions = () => {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const fetchMyQuestions = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await API.get('/users/me/my-questions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setQuestions(res.data.data)
      } catch (err) {
        console.error('Sorular alınamadı:', err)
      }
    }

    fetchMyQuestions()
  }, [])

  const handleDelete = async (id) => {
    const confirm = window.confirm('Bu soruyu silmek istediğinizden emin misiniz?')
    if (!confirm) return

    try {
      const token = localStorage.getItem('token')
      await API.delete(`/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Silinen soruyu listeden çıkar
      setQuestions(prev => prev.filter(q => q._id !== id))
    } catch (err) {
      console.error('Soru silinemedi:', err)
      alert('Soru silinirken hata oluştu.')
    }
  }

  return (
    <div>
      <h2>📝 Sorduğum Sorular</h2>
      {questions.length === 0 ? (
        <p>Henüz hiç soru sormamışsınız.</p>
      ) : (
        <div>
          {questions.map((q) => (
            <div key={q._id} style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              backgroundColor: '#f8f9fa'
            }}>
              <Link to={`/questions/${q._id}`} style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                {q.title}
              </Link>
              <div
                dangerouslySetInnerHTML={{ __html: q.content.slice(0, 120) + '...' }}
                style={{ marginTop: '10px', fontSize: '14px' }}
              />
              <small>{new Date(q.createdAt).toLocaleString()}</small>

              <br />

              <button
                onClick={() => handleDelete(q._id)}
                style={{
                  marginTop: '10px',
                  backgroundColor: 'crimson',
                  color: 'white',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyQuestions
