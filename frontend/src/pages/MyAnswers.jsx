import { useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const MyAnswers = () => {
  const [answers, setAnswers] = useState([])

  const fetchMyAnswers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await API.get('/users/me/my-answers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAnswers(res.data.data)
    } catch (err) {
      console.error('Cevaplar alınamadı:', err)
    }
  }

  const handleDelete = async (answerId) => {
    const confirm = window.confirm('Bu cevabı silmek istediğine emin misin?')
    if (!confirm) return

    try {
      const token = localStorage.getItem('token')
      await API.delete(`/answers/${answerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Silinen cevabı listeden çıkar
      setAnswers(prev => prev.filter(a => a._id !== answerId))
    } catch (err) {
      console.error('Cevap silinemedi:', err)
      alert('Silme işlemi sırasında hata oluştu.')
    }
  }

  useEffect(() => {
    fetchMyAnswers()
  }, [])

  return (
    <div>
      <h2>Verdiğim Cevaplar</h2>
      <ul>
        {answers.map((answer) => (
          <li key={answer._id} style={{ marginBottom: '20px' }}>
            <Link to={`/questions/${answer.question.slug}`} style={{ fontWeight: 'bold', color: '#4A6EF3' }}>
              {answer.question.title}
            </Link>
            <div dangerouslySetInnerHTML={{ __html: answer.content }} />
            <small>{new Date(answer.createdAt).toLocaleString()}</small>
            <br />
            <button onClick={() => handleDelete(answer._id)} style={{ marginTop: '5px' }}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MyAnswers
