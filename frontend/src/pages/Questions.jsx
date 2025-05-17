import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const Questions = () => {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get('/questions')
        setQuestions(res.data.data)
      } catch (err) {
        console.error('Soru listesi alınamadı:', err)
      }
    }

    fetchQuestions()
  }, [])

  return (
    <div>
      <h2>Tüm Sorular</h2>
      {questions.length === 0 ? (
        <p>Hiç soru yok.</p>
      ) : (
        questions.map((q) => (
          <div key={q._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
            <h3>
              <Link to={`/questions/${q._id}`}>{q.title}</Link>
            </h3>

            {/* İçeriğin kısa özeti */}
            <p style={{ color: '#555' }}>
              {q.content?.replace(/<[^>]+>/g, '').slice(0, 100)}...
            </p>

            {/* Etiketler */}
            <div style={{ marginBottom: '10px' }}>
              {q.tags && q.tags.map(tag => (
                <span key={tag} style={{
                  backgroundColor: '#fed7aa',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  marginRight: '8px',
                  fontSize: '12px'
                }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Bilgiler */}
            <small>
              Soran: {q.author?.name || 'Bilinmiyor'} • {new Date(q.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  )
}

export default Questions
