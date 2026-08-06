import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-50">
        <div className="h-8 w-8 rounded-full border-2 border-brand-300 border-t-brand-700 animate-spin" />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}
