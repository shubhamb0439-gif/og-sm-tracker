import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarClock, Kanban, LogOut } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/planner', label: 'Content Planner', icon: CalendarClock },
  { to: '/pipeline', label: 'Content Creation Pipeline', icon: Kanban },
]

export default function Layout({ children }) {
  const { profile, user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const initials = (profile?.display_name || user?.email || '?').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen flex bg-transparent">
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-brand-100 bg-white/70 backdrop-blur-sm px-4 py-6">
        <div className="px-2 mb-8">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-800 text-white shadow-lg shadow-brand-800/20'
                    : 'text-brand-800/80 hover:bg-brand-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 border-t border-brand-100 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-900 truncate">
                {profile?.display_name || 'Team member'}
              </p>
              <p className="text-xs text-brand-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-3 w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-brand-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <Logo className="h-8 w-auto" />
          <button onClick={handleSignOut} className="text-brand-700">
            <LogOut size={20} />
          </button>
        </header>

        <nav className="md:hidden flex overflow-x-auto gap-1 px-3 py-2 bg-white/60 border-b border-brand-100">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-brand-800 text-white' : 'text-brand-700 bg-brand-100'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
