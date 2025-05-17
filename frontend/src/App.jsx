import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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

function App() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <div>
      {/* 🔁 Sadece admin sayfaları için AdminNavbar */}
      {isAdminPath ? <AdminNavbar /> : <Navbar />}

      <div style={{ padding: '20px' }}>
        <Routes>
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
          
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
