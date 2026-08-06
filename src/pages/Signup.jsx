import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    const { data, error } = await signUp({ email, password, displayName })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.session) {
      navigate('/')
    } else {
      setInfo('Account created! Check your email to confirm, then log in.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo className="h-14 w-auto" showWordmark={false} />
        </div>
        <div className="card p-7">
          <h1 className="text-xl font-bold text-brand-900 text-center">Create your account</h1>
          <p className="text-sm text-brand-500 text-center mt-1 mb-6">
            Everyone on the team shares one workspace
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-1">Your name</label>
              <input
                type="text"
                required
                className="input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Sangeetha"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {info && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{info}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-brand-600 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-800 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
