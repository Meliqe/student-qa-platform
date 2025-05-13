import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import API from '../api/axios'
import { UserContext } from '../context/UserContext'
import 'react-quill/dist/quill.snow.css'


const QuestionDetail = () => {
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  const [newAnswer, setNewAnswer] = useState('')
  const { user } = useContext(UserContext)

  const fetchDetail = async () => {
    try {
      const res = await API.get(`/questions/${id}`)
      setQuestion(res.data.data)
    } catch (err) {
      console.error('Soru detayı alınamadı:', err)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleSubmit = async () => {
    if (!newAnswer.trim()) return alert('Boş cevap gönderilemez.')

    try {
      const token = localStorage.getItem('token')

      await API.post(`/questions/${id}/answers`, {
        content: newAnswer
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setNewAnswer('')
      fetchDetail() // Cevap eklendikten sonra tekrar yükle
    } catch (err) {
      console.error('Cevap gönderilemedi:', err)
      alert('Cevap gönderilirken hata oluştu.')
    }
  }

  if (!question) return <p>Yükleniyor...</p>

  return (
    <div>
      <h2>{question.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: question.content }} />

      <hr />

      <h3>Cevaplar</h3>
      {question.answers && question.answers.length > 0 ? (
        <ul>
          {question.answers.map((answer) => (
            <li key={answer._id} style={{ marginBottom: '10px' }}>
              <div dangerouslySetInnerHTML={{ __html: answer.content }} />
              <small>
                Yanıtlayan: {answer.author?.name || 'Anonim'} •{' '}
                {new Date(answer.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Henüz cevap yok.</p>
      )}

      <hr />

      <h3>Cevap Yaz</h3>
      {user ? (
        <div>
          <ReactQuill value={newAnswer} onChange={setNewAnswer} />
          <button onClick={handleSubmit} style={{ marginTop: '10px' }}>
            Gönder
          </button>
        </div>
      ) : (
        <p style={{ color: 'gray' }}>
          Cevap yazmak için <strong>giriş yapmalısınız</strong>.
        </p>
      )}
    </div>
  )
}

export default QuestionDetail
