import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import 'react-quill/dist/quill.snow.css'
import API from './api/axios'
import socket from './socket'

// Layoutlar ve componentler
import Navbar from './components/Navbar'
import AdminNavbar from './components/AdminNavbar'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

// Sayfalar
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Questions from './pages/Questions'
import QuestionDetail from './pages/QuestionDetail'
import AddQuestion from './pages/AddQuestion'
import MyAnswers from './pages/MyAnswers'
import MyQuestions from './pages/MyQuestions'
import AdminPanel from './pages/AdminPanel'
import AdminUsers from './pages/AdminUsers'
import AdminStats from './pages/AdminStats'
import AdminVisits from './pages/AdminVisits'
import AdminAnnouncements from './pages/AdminAnnouncements'

// 👤 Kullanıcı layout'u
const UserLayout = ({ children }) => (
  <>
    <Navbar />
    <div style={{ padding: '20px' }}>
      {children}
    </div>
  </>
)

// 🛠 Admin layout'u
const AdminLayout = ({ children }) => (
  <>
    <AdminNavbar />
    <div style={{ padding: '20px' }}>
      {children}
    </div>
  </>
)

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      socket.auth = { token }
      socket.connect()
      socket.on('connect', () => console.log('Socket bağlı:', socket.id))
      socket.on('disconnect', () => console.log('Socket bağlantısı kesildi'))
    }

    const user = JSON.parse(localStorage.getItem('user'))
    if (user?.role !== 'admin') {
      if (!sessionStorage.getItem('visitCounted')) {
        API.post('/visit')
          .then(() => sessionStorage.setItem('visitCounted', 'true'))
          .catch(err => console.error('Ziyaretçi sayacı artırılamadı:', err))
      }
    }
  }, [])

  return (
    <Routes>
      {/* Giriş sayfası (layout yok) */}
      <Route path="/login" element={<Login />} />

      {/* 👤 Kullanıcı alanı */}
      <Route path="/" element={<UserLayout><Home /></UserLayout>} />
      <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
      <Route path="/profile" element={
        <PrivateRoute>
          <UserLayout><Profile /></UserLayout>
        </PrivateRoute>
      } />
      <Route path="/questions" element={<UserLayout><Questions /></UserLayout>} />
      <Route path="/questions/:id" element={<UserLayout><QuestionDetail /></UserLayout>} />
      <Route path="/add-question" element={
        <PrivateRoute>
          <UserLayout><AddQuestion /></UserLayout>
        </PrivateRoute>
      } />
      <Route path="/my-answers" element={
        <PrivateRoute>
          <UserLayout><MyAnswers /></UserLayout>
        </PrivateRoute>
      } />
      <Route path="/my-questions" element={
        <PrivateRoute>
          <UserLayout><MyQuestions /></UserLayout>
        </PrivateRoute>
      } />

      {/* 🛠 Admin paneli */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout><AdminPanel /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminLayout><AdminUsers /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/stats" element={
        <AdminRoute>
          <AdminLayout><AdminStats /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/visit" element={
        <AdminRoute>
          <AdminLayout><AdminVisits /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/announcements" element={
        <AdminRoute>
          <AdminLayout><AdminAnnouncements /></AdminLayout>
        </AdminRoute>
      } />
    </Routes>
  )
}

export default App
