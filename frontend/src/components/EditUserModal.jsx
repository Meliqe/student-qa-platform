import { useState, useEffect } from 'react'

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setRole(user.role || 'user')
    }
  }, [user])

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      alert("İsim ve e-posta boş olamaz!")
      return
    }

    onSave({ ...user, name, email, role })
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h3>Kullanıcıyı Güncelle</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="İsim" style={{ width: '100%', marginBottom: '10px' }} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" style={{ width: '100%', marginBottom: '10px' }} />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} style={{ marginRight: '10px' }}>İptal</button>
          <button onClick={handleSave}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}

export default EditUserModal
