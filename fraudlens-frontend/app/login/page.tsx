'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, setToken, setUser } from '../../lib/api'

export default function LoginPage() {
  const router = useRouter()

  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'agent',
  })

  const update = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  const submit = async () => {
    setError('')
    setLoading(true)

    try {
      const res =
        tab === 'login'
          ? await api.login({
              email: form.email,
              password: form.password,
            })
          : await api.register(form)

      setToken(res.token)
      setUser(res.user)

      router.push('/dashboard')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #dbeafe 0%, transparent 70%)',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #eff6ff 0%, transparent 70%)',
            opacity: 0.6,
          }}
        />
      </div>

      <div
        className="anim-scale-in"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px #2563eb33',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--text)',
              }}
            >
              FraudLens
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Système de détection de fraude en assurance
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--r-xl)', // ✅ FIX ICI
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t)
                  setError('')
                }}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: 'uppercase',
                  color: tab === t ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom:
                    tab === t
                      ? '2px solid var(--primary)'
                      : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'all .2s',
                }}
              >
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tab === 'register' && (
                <div>
                  <label>Nom complet</label>
                  <input
                    className="inp"
                    value={form.nom}
                    onChange={(e) => update('nom', e.target.value)}
                  />
                </div>
              )}

              <div>
                <label>Email</label>
                <input
                  className="inp"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>

              <div>
                <label>Mot de passe</label>
                <input
                  className="inp"
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
              </div>

              {error && <div style={{ color: 'red' }}>{error}</div>}

              <button onClick={submit} disabled={loading}>
                {loading ? 'Chargement...' : tab === 'login' ? 'Login' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .inp {
          width: 100%;
          padding: 10px;
          border-radius: var(--r-md); /* ✅ FIX ICI */
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  )
}