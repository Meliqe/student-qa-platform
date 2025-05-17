import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'

import API from '../api/axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const loginRes = await API.post('/auth/login', { email, password })

      const { token, user } = loginRes.data
      const fixedUser = { ...user, _id: user.id }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(fixedUser))

      setUser(fixedUser)

      if (user.role === 'admin') {
  navigate('/admin')
} else {
  navigate('/')
}

    } catch (err) {
      console.error('Giriş hatası:', err)
      alert('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
    }
  }

  return (
    <div>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Şifre:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  )
}

export default Login
