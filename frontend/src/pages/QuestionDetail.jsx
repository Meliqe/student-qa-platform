import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import API from '../api/axios'
import { UserContext } from '../context/UserContext'
import 'react-quill/dist/quill.snow.css'

const QuestionDetail = () => {
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const [voting, setVoting] = useState({})
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
const handleDeleteAnswer = async (answerId) => {
  const confirm = window.confirm('Bu cevabı silmek istediğinizden emin misiniz?')
  if (!confirm) return

  try {
    const token = localStorage.getItem('token')
    await API.delete(`/answers/${answerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    fetchDetail() // Sayfayı güncelle
  } catch (err) {
    console.error('Cevap silinemedi:', err)
    alert('Silme işlemi başarısız oldu.')
  }
}

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

  const handleUpvote = async (answerId) => {
  try {
    setVoting(prev => ({ ...prev, [answerId]: true }))
    const token = localStorage.getItem('token')
    await API.put(`/answers/${answerId}/upvote`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchDetail()
  } catch (err) {
    alert('Zaten oy verdiniz veya hata oluştu.')
    console.error(err)
  } finally {
    setVoting(prev => ({ ...prev, [answerId]: false }))
  }
}

const handleRemoveUpvote = async (answerId) => {
  try {
    setVoting(prev => ({ ...prev, [answerId]: true }))
    const token = localStorage.getItem('token')
    await API.delete(`/answers/${answerId}/remove-upvote`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchDetail()
  } catch (err) {
    alert('Oyunuz zaten yok veya hata oluştu.')
    console.error(err)
  } finally {
    setVoting(prev => ({ ...prev, [answerId]: false }))
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
        {question.answers.map((answer) => (
          <li key={answer._id} style={{ marginBottom: '20px' }}>
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

                {isAnswerOwner(answer) && (
                  <div style={{ marginTop: '5px' }}>
                    <button onClick={() => {
                      setEditingAnswerId(answer._id)
                      setEditedContent(answer.content)
                    }}>
                      Güncelle
                    </button>

                    <button
                      style={{ marginLeft: '10px', color: 'red' }}
                      onClick={() => handleDeleteAnswer(answer._id)}
                    >
                      Sil
                    </button>
                  </div>
                )}

                {/* Oy verme butonları */}
                <div style={{ marginTop: '10px' }}>
                  <strong>Oy Sayısı:</strong> {answer.upvotes}
                  {/*Oy verme butonları (sadece başkalarının cevaplarına gösterilir) */}
{user && !isAnswerOwner(answer) && (
  <div style={{ marginTop: '10px' }}>
    <strong>Oy Sayısı:</strong> {answer.upvotes}
    <div style={{ marginTop: '5px' }}>
      <button
        disabled={voting[answer._id]}
        onClick={() => handleUpvote(answer._id)}
      >
        Oy Ver
      </button>
      <button
        disabled={voting[answer._id]}
        onClick={() => handleRemoveUpvote(answer._id)}
        style={{ marginLeft: '8px' }}
      >
        Oyu Geri Al
      </button>
    </div>
  </div>
)}
                </div>
              </>
            )}
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
