import { useEffect, useState } from 'react'
import API from '../api/axios'
import EditUserModal from '../components/EditUserModal'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await API.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(res.data.data)
    } catch (err) {
      console.error('Kullanıcılar alınamadı:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kullanıcıyı silmek istiyor musunuz?')) return
    try {
      const token = localStorage.getItem('token')
      await API.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // State üzerinden sil
      setUsers(prevUsers => prevUsers.filter(user => user._id !== id))
    } catch (err) {
      alert('Silme başarısız.', err)
    }
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSaveUser = async (updatedUser) => {
    try {
      const token = localStorage.getItem('token')
      await API.put(`/users/${updatedUser._id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // State içinde güncelle
      setUsers(prevUsers =>
        prevUsers.map(u => (u._id === updatedUser._id ? updatedUser : u))
      )

      setIsModalOpen(false)
    } catch (err) {
      alert('Güncelleme başarısız.', err)
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>👥 Kullanıcı Yönetimi</h2>

      <input
        type="text"
        placeholder="İsim veya e-posta ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', width: '300px', marginBottom: '20px', borderRadius: '5px' }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '8px',
              width: '250px',
              backgroundColor: user.role === 'admin' ? '#fff3cd' : '#f1f1f1'
            }}
          >
            <p><strong>{user.name}</strong></p>
            <p>{user.email}</p>
            <p>Rol: <strong>{user.role}</strong></p>
            <button onClick={() => handleDelete(user._id)} style={{ color: 'red' }}>
              Sil
            </button>
            <button onClick={() => openEditModal(user)} style={{ marginLeft: '10px' }}>
              Güncelle
            </button>
          </div>
        ))}
      </div>

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  )
}

export default AdminUsers
