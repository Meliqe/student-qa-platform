import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import API from '../api/axios'
import { UserContext } from '../context/UserContext'
import 'react-quill/dist/quill.snow.css'

const QuestionDetail = () => {
  const { id } = useParams()
  const { user } = useContext(UserContext)

  const [question, setQuestion] = useState(null)
  const [newAnswer, setNewAnswer] = useState('')
  const [editingAnswerId, setEditingAnswerId] = useState(null)
  const [editedContent, setEditedContent] = useState('')

  // 🧠 Cevap sahibi mi kontrolü
  const isAnswerOwner = (answer) => {
  try {
    return (
      user &&
      user.id && 
      answer?.author?._id &&
      String(user.id) === String(answer.author._id)
    )
  } catch (err) {
    console.warn('Cevap sahibi kontrolü hatası:', err)
    return false
  }
}


  // 📥 Soru detayını çek
  const fetchDetail = async () => {
    try {
      const res = await API.get(`/questions/${id}`)
      let questionData = res.data.data

      // Cevaplar: Kendi cevabın varsa yukarı al
      if (user && questionData.answers?.length > 0) {
        const own = questionData.answers.filter(a => String(a.author?._id) === String(user._id))
        const others = questionData.answers.filter(a => String(a.author?._id) !== String(user._id))
        questionData.answers = [...own, ...others]
      }

      setQuestion(questionData)
    } catch (err) {
      console.error('Soru detayı alınamadı:', err)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])
  console.log('user:', user)
  // ✏️ Cevap ekleme
  const handleSubmit = async () => {
    if (!newAnswer.trim()) return alert('Boş cevap gönderilemez.')

    try {
      const token = localStorage.getItem('token')
      await API.post(`/questions/${id}/answers`, { content: newAnswer }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setNewAnswer('')
      fetchDetail()
    } catch (err) {
      console.error('Cevap gönderilemedi:', err)
      alert('Cevap gönderilirken hata oluştu.')
    }
  }

  // 🔁 Cevap güncelleme
  const handleUpdateAnswer = async (answerId) => {
    if (!editedContent.trim()) return alert('Boş içerik gönderilemez.')

    try {
      const token = localStorage.getItem('token')
      await API.put(`/answers/${answerId}`, { content: editedContent }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setEditingAnswerId(null)
      setEditedContent('')
      fetchDetail()
    } catch (err) {
      console.error('Cevap güncellenemedi:', err)
      alert('Güncelleme sırasında hata oluştu.')
    }
  }

  if (!question) return <p>Yükleniyor...</p>

  return (
    <div>
      <h2>{question.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: question.content }} />

      <hr />

      <h3>Cevaplar</h3>
      {question.answers?.length > 0 ? (
        <ul>
          {question.answers.map((answer) => {
            console.log('answer.author:', answer.author)
            const isOwner = isAnswerOwner(answer)

            return (
              <li key={answer._id} style={{ marginBottom: '10px' }}>
                {editingAnswerId === answer._id ? (
                  <div>
                    <ReactQuill value={editedContent} onChange={setEditedContent} />
                    <button onClick={() => handleUpdateAnswer(answer._id)}>Kaydet</button>
                    <button onClick={() => setEditingAnswerId(null)}>İptal</button>
                  </div>
                ) : (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: answer.content }} />
                    <small>
                      Yanıtlayan: {answer.author?.name || 'Anonim'} •{' '}
                      {new Date(answer.createdAt).toLocaleString()}
                    </small>
                    {isOwner && (
                      <div>
                        <button onClick={() => {
                          setEditingAnswerId(answer._id)
                          setEditedContent(answer.content)
                        }}>
                          Güncelle
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            )
          })}
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
