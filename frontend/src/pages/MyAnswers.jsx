import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import { UserContext } from '../context/UserContext'

const MyAnswers = () => {
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    const fetchAnswers = async () => {
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

    fetchAnswers()
  }, [])

  return (
    <div>
      <h2>Verdiğim Cevaplar</h2>
      {answers.length > 0 ? (
        <ul>
          {answers.map((answer) => (
            <li key={answer._id} style={{ marginBottom: '15px' }}>
              <Link to={`/questions/${answer.question._id}`}>
                <strong>{answer.question.title}</strong>
              </Link>
              <div dangerouslySetInnerHTML={{ __html: answer.content.slice(0, 150) + '...' }} />
              <small>{new Date(answer.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Henüz cevap yazmadınız.</p>
      )}
    </div>
  )
}

export default MyAnswers
