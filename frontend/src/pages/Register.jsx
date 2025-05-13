import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      // 1. Kayıt isteği
      await API.post('/auth/register', {
        name,
        email,
        password
      })

      // 2. Başarılıysa login sayfasına yönlendir
      alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.')
      navigate('/login')
    } catch (err) {
      console.error('Kayıt hatası:', err)
      alert('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.')
    }
  }

  return (
    <div>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>İsim:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  )
}

export default Register
