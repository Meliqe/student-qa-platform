import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { Link ,useNavigate} from 'react-router-dom'
import API from '../api/axios'

const Profile = () => {
  const { user } = useContext(UserContext)
  const [, setMyQuestions] = useState([])

  const navigate = useNavigate()
  const fetchMyQuestions = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await API.get('/users/me/my-questions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMyQuestions(res.data.data)
    } catch (err) {
      console.error('Kullanıcı soruları çekilemedi:', err)
    }
  }

  useEffect(() => {
    fetchMyQuestions()
  }, [])

  return (
    <div>
      <h2>Profilim</h2>
      <p><strong>Ad:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <hr />
      <button onClick={() => navigate('/my-answers')} style={{ marginTop: '10px', marginBottom: '20px' }}>
        Cevaplarımı Gör
      </button>
      <h3>Benim Sorularım</h3>
      <button onClick={() => navigate('/my-questions')} style={{ marginRight: '10px' }}>
  Sorularımı Gör
</button>
      
    </div>
  )
}

export default Profile
