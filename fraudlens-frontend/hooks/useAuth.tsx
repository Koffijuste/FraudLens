'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import api from '@/lib/api'

interface AuthCtx {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (nom: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('fl_token')
    const u = localStorage.getItem('fl_user')
    if (t && u) { setToken(t); setUser(JSON.parse(u)) }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('fl_token', data.token)
    localStorage.setItem('fl_user', JSON.stringify(data.user))
    setToken(data.token); setUser(data.user)
  }

  const register = async (nom: string, email: string, password: string, role: string) => {
    const { data } = await api.post('/auth/register', { nom, email, password, role })
    localStorage.setItem('fl_token', data.token)
    localStorage.setItem('fl_user', JSON.stringify(data.user))
    setToken(data.token); setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('fl_token'); localStorage.removeItem('fl_user')
    setToken(null); setUser(null)
    window.location.href = '/auth/login'
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
