import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'

const QuestionDetail = () => {
  const { id } = useParams()
  const [question, setQuestion] = useState(null)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await API.get(`/questions/${id}`)
        setQuestion(res.data.data) // ← burada dikkat!
      } catch (err) {
        console.error('Soru detayı alınamadı:', err)
      }
    }

    fetchDetail()
  }, [id])

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
              <p>{answer.content}</p>
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
    </div>
  )
}

export default QuestionDetail
