import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const Questions = () => {
  const [questions, setQuestions] = useState([])
  const [keyword, setKeyword] = useState('')
  const [tagKeyword, setTagKeyword] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchQuestions = async (type = 'default') => {
    try {
      setLoading(true)
      let url = '/questions'

      if (type === 'keyword' && keyword.trim()) {
        url = `/questions/search?keyword=${encodeURIComponent(keyword.trim())}`
      } else if (type === 'tag' && tagKeyword.trim()) {
        url = `/questions/by-tag?tag=${encodeURIComponent(tagKeyword.trim())}`
      }

      const res = await API.get(url)
      setQuestions(res.data.data)
    } catch (err) {
      console.error('Soru listesi alınamadı:', err)
    } finally {
      setLoading(false)
    }
  }

  // İlk açılışta tüm soruları getir
  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
  if (keyword.trim() === '' && tagKeyword.trim() === '') {
    fetchQuestions()
  }
}, [keyword, tagKeyword])

  const handleKeywordSearch = (e) => {
    e.preventDefault()
    setTagKeyword('')
    if (keyword.trim()) {
      fetchQuestions('keyword')
    } else {
      fetchQuestions()
    }
  }

  const handleTagSearch = (e) => {
    e.preventDefault()
    setKeyword('')
    if (tagKeyword.trim()) {
      fetchQuestions('tag')
    } else {
      fetchQuestions()
    }
  }

  return (
    <div>
      <h2>Tüm Sorular</h2>

      {/* 🔍 Anahtar kelime arama */}
      <form onSubmit={handleKeywordSearch} style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Başlık veya içerikte ara..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: '8px',
            width: '300px',
            marginRight: '10px',
            borderRadius: '5px'
          }}
        />
        <button type="submit">Kelime ile Ara</button>
      </form>

      {/* 🏷️ Etiket arama */}
      <form onSubmit={handleTagSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Etiket girin (ör: react)"
          value={tagKeyword}
          onChange={(e) => setTagKeyword(e.target.value)}
          style={{
            padding: '8px',
            width: '300px',
            marginRight: '10px',
            borderRadius: '5px'
          }}
        />
        <button type="submit">Etikete Göre Ara</button>
      </form>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : questions.length === 0 ? (
        <p>Soru bulunamadı.</p>
      ) : (
        questions.map((q) => (
          <div key={q._id} style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px'
          }}>
            <h3>
              <Link to={`/questions/${q._id}`}>{q.title}</Link>
            </h3>

            <p style={{ color: '#555' }}>
              {q.content?.replace(/<[^>]+>/g, '').slice(0, 100)}...
            </p>

            <div style={{ marginBottom: '10px' }}>
              {q.tags?.map(tag => (
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
