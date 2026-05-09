'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, setToken, setUser } from '../../lib/api'

export default function LoginPage() {
  const router = useRouter()

  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'agent',
  })

  const update = (k: keyof typeof form, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

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
      setError(e instanceof Error ? e.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="auth-page">
        {/* Background */}
        <div className="bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
        </div>

        {/* Card */}
        <div className="card">
          {/* Header */}
          <div className="header">
            <div className="logo-wrap">
              <div className="logo">
                <svg
                  width="26"
                  height="26"
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

              <div>
                <h1>FraudLens</h1>
                <p>Détection intelligente de fraude</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                className={`tab-btn ${tab === t ? 'active' : ''}`}
                onClick={() => {
                  setTab(t)
                  setError('')
                }}
              >
                <span>
                  {t === 'login'
                    ? 'Connexion'
                    : 'Inscription'}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="form">
            {tab === 'register' && (
              <div className="field">
                <label>Nom complet</label>

                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.nom}
                  onChange={(e) =>
                    update('nom', e.target.value)
                  }
                />
              </div>
            )}

            <div className="field">
              <label>Email</label>

              <input
                type="email"
                placeholder="exemple@email.com"
                value={form.email}
                onChange={(e) =>
                  update('email', e.target.value)
                }
              />
            </div>

            <div className="field">
              <label>Mot de passe</label>

              <div className="password-box">
                <input
                  type={
                    showPassword ? 'text' : 'password'
                  }
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    update(
                      'password',
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' && submit()
                  }
                />

                <button
                  type="button"
                  className="show-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>


            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              className="submit-btn"
              onClick={submit}
              disabled={loading}
            >
              <span>
                {loading
                  ? 'Chargement...'
                  : tab === 'login'
                  ? 'Se connecter'
                  : 'Créer un compte'}
              </span>

              {!loading && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #020617;
          position: relative;
          overflow: hidden;
          font-family: Inter, sans-serif;
        }

        .bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .blob {
          position: absolute;
          border-radius: 999px;
          filter: blur(70px);
          opacity: 0.4;
        }

        .blob-1 {
          width: 500px;
          height: 500px;
          top: -10%;
          right: -10%;
          background: #2563eb;
        }

        .blob-2 {
          width: 450px;
          height: 450px;
          bottom: -10%;
          left: -10%;
          background: #60a5fa;
        }

        .card {
          width: 100%;
          max-width: 460px;
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(24px);
          overflow: hidden;
          position: relative;
          z-index: 2;
          box-shadow:
            0 25px 60px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.05);
          animation: fadeUp 0.5s ease;
        }

        .header {
          padding: 34px 32px 24px;
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo {
          width: 64px;
          height: 64px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            #2563eb,
            #60a5fa
          );
          box-shadow:
            0 15px 35px rgba(37,99,235,0.35),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }

        h1 {
          margin: 0;
          color: white;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 14px;
        }

        .tabs {
          display: flex;
          gap: 10px;
          padding: 10px;
          margin: 0 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          backdrop-filter: blur(12px);
        }

        .tab-btn {
          flex: 1;
          height: 52px;
          border: none;
          border-radius: 16px;
          background: transparent;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .tab-btn span {
          position: relative;
          z-index: 2;
        }

        .tab-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            rgba(37,99,235,0.15),
            rgba(59,130,246,0.05)
          );
          opacity: 0;
          transition: 0.25s ease;
        }

        .tab-btn:hover {
          color: white;
          transform: translateY(-2px);
        }

        .tab-btn:hover::before {
          opacity: 1;
        }

        .tab-btn.active {
          color: white;
          background: linear-gradient(
            135deg,
            #2563eb,
            #3b82f6
          );
          box-shadow:
            0 12px 30px rgba(37,99,235,0.35),
            inset 0 1px 0 rgba(255,255,255,0.18);
        }

        .tab-btn.active::before {
          display: none;
        }

        .form {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        input,
        select {
          width: 100%;
          height: 54px;
          padding: 0 16px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.25s ease;
          backdrop-filter: blur(10px);
        }

        input::placeholder {
          color: #64748b;
        }

        input:hover,
        select:hover {
          border-color: rgba(59,130,246,0.35);
          background: rgba(255,255,255,0.06);
        }

        input:focus,
        select:focus {
          border-color: #3b82f6;
          background: rgba(255,255,255,0.08);
          box-shadow:
            0 0 0 4px rgba(59,130,246,0.15),
            0 10px 30px rgba(37,99,235,0.15);
        }

        .password-box {
          position: relative;
        }

        .password-box input {
          padding-right: 55px;
        }

        .show-btn {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }

        .submit-btn {
          width: 100%;
          height: 58px;
          border: none;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #3b82f6
          );
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow:
            0 14px 30px rgba(37,99,235,0.3),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.25),
            transparent
          );
          transition: 0.7s;
        }

        .submit-btn:hover::before {
          left: 120%;
        }

        .submit-btn:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow:
            0 18px 40px rgba(37,99,235,0.45),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }

        .submit-btn:active {
          transform: scale(0.98);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .error {
          padding: 14px;
          border-radius: 16px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
          font-size: 14px;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 520px) {
          .card {
            border-radius: 26px;
          }

          .header,
          .form {
            padding: 24px;
          }

          h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  )
}