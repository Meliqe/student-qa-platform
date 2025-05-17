import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const Questions = () => {
  const [questions, setQuestions] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const url = keyword
        ? `/questions/search?keyword=${encodeURIComponent(keyword)}`
        : '/questions'
      const res = await API.get(url)
      setQuestions(res.data.data)
    } catch (err) {
      console.error('Soru listesi alınamadı:', err)
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
  if (keyword.trim() === '') {
    fetchQuestions()
  }
}, [keyword])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchQuestions()
  }

  return (
    <div>
      <h2>Tüm Sorular</h2>

      {/* 🔍 Arama Barı */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Anahtar kelime girin..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: '8px',
            width: '300px',
            marginRight: '10px',
            borderRadius: '5px'
          }}
        />
        <button type="submit">Ara</button>
      </form>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : questions.length === 0 ? (
        <p>Hiç soru yok.</p>
      ) : (
        questions.map((q) => (
          <div
            key={q._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px'
            }}
          >
            <h3>
              <Link to={`/questions/${q._id}`}>{q.title}</Link>
            </h3>

            <p style={{ color: '#ccc' }}>
              {q.content?.replace(/<[^>]+>/g, '').slice(0, 100)}...
            </p>

            <div style={{ marginBottom: '10px' }}>
              {q.tags &&
                q.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: '#fed7aa',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      marginRight: '8px',
                      fontSize: '12px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            <small>
              Soran: {q.author?.name || 'Bilinmiyor'} •{' '}
              {new Date(q.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  )
}

export default Questions
