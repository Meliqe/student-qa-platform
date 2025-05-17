import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css'
import Navbar from './components/Navbar'
import AdminNavbar from './components/AdminNavbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import Questions from './pages/Questions'
import QuestionDetail from './pages/QuestionDetail'
import AddQuestion from './pages/AddQuestion'
import MyAnswers from './pages/MyAnswers'
import MyQuestions from './pages/MyQuestions'
import AdminRoute from './components/AdminRoute'
import AdminPanel from './pages/AdminPanel'
import AdminUsers from './pages/AdminUsers'
import AdminStats from './pages/AdminStats'
import AdminVisits from './pages/AdminVisits'
import AdminAnnouncements from './pages/AdminAnnouncements'

function App() {

  const location = useLocation()
  const navigate = useNavigate()
  const isAdminPath = location.pathname.startsWith('/admin')

   useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    // Eğer admin ise ve şu an "/" yolundaysa, admin panele yönlendir
    if (user?.role === 'admin' && location.pathname === '/') {
      navigate('/admin')
    }
  }, [location.pathname])

  return (
    <div>
      {/* 🔁 Admin için farklı navbar */}
      {isAdminPath ? <AdminNavbar /> : <Navbar />}

      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Normal kullanıcı sayfaları */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route
            path="/add-question"
            element={
              <PrivateRoute>
                <AddQuestion />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-answers"
            element={
              <PrivateRoute>
                <MyAnswers />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-questions"
            element={
              <PrivateRoute>
                <MyQuestions />
              </PrivateRoute>
            }
          />

          {/* 🛠️ Admin sayfaları */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <AdminRoute>
                <AdminStats />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/visit"
            element={
              <AdminRoute>
                <AdminVisits />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <AdminRoute>
                <AdminAnnouncements />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
