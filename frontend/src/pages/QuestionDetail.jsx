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

  const isAnswerOwner = (answer) => {
    try {
      return user && user.id && answer?.author?._id && String(user.id) === String(answer.author._id)
    } catch {
      return false
    }
  }

  const isQuestionOwner = () => {
    return user && question?.author?._id && String(user.id) === String(question.author._id)
  }

  const fetchDetail = async () => {
    try {
      const res = await API.get(`/questions/${id}`)
      const data = res.data.data

      // En iyi cevabı en üste taşı
      if (data.bestAnswer) {
        const best = data.answers.find(a => a._id === data.bestAnswer)
        const rest = data.answers.filter(a => a._id !== data.bestAnswer)
        data.answers = best ? [best, ...rest] : rest
      }

      setQuestion(data)
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
      await API.post(`/questions/${id}/answers`, { content: newAnswer }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNewAnswer('')
      fetchDetail()
    } catch (err) {
      alert('Cevap gönderilemedi.')
      console.error(err)
    }
  }

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Bu cevabı silmek istiyor musunuz?')) return
    try {
      const token = localStorage.getItem('token')
      await API.delete(`/answers/${answerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDetail()
    } catch (err) {
      alert('Silme işlemi başarısız.')
      console.error(err)
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
      alert('Güncelleme hatası.')
      console.error(err)
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
      alert('Oy verilemedi.')
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
      alert('Oyunuz zaten yok.')
      console.error(err)
    } finally {
      setVoting(prev => ({ ...prev, [answerId]: false }))
    }
  }

  const handleMarkBest = async (answerId) => {
    try {
      const token = localStorage.getItem('token')
      await API.put(`/answers/${answerId}/best/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDetail()
    } catch (err) {
      alert('En iyi cevap işaretlenemedi.')
      console.error(err)
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
            <li key={answer._id} style={{
  marginBottom: '20px',
  border: question.bestAnswer === answer._id ? '2px solid #999' : '1px solid #999',
  padding: '12px',
  borderRadius: '6px',
  backgroundColor: question.bestAnswer === answer._id ? '#444' : '#555',
  color: '#fff'
}}>


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

                  {question.bestAnswer === answer._id && (
                    <div style={{ color: 'gold', fontWeight: 'bold' }}>🌟 En İyi Cevap</div>
                  )}

                  {isQuestionOwner() && question.bestAnswer !== answer._id && (
                    <button onClick={() => handleMarkBest(answer._id)} style={{ marginTop: '5px' }}>
                      ✅ En İyi Cevap Olarak İşaretle
                    </button>
                  )}

                  {isAnswerOwner(answer) && (
                    <div style={{ marginTop: '10px' }}>
                      <button onClick={() => {
                        setEditingAnswerId(answer._id)
                        setEditedContent(answer.content)
                      }}>
                        Güncelle
                      </button>
                      <button style={{ marginLeft: '10px', color: 'red' }} onClick={() => handleDeleteAnswer(answer._id)}>
                        Sil
                      </button>
                    </div>
                  )}

                  {!isAnswerOwner(answer) && user && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>Oy Sayısı:</strong> {answer.upvotes}
                      <div style={{ marginTop: '5px' }}>
                        <button disabled={voting[answer._id]} onClick={() => handleUpvote(answer._id)}>Oy Ver</button>
                        <button disabled={voting[answer._id]} onClick={() => handleRemoveUpvote(answer._id)} style={{ marginLeft: '8px' }}>
                          Oyu Geri Al
                        </button>
                      </div>
                    </div>
                  )}
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
          <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Gönder</button>
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
