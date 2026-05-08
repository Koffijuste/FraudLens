'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(form.email, form.password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'400px' }} className="anim-scale-in">

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ width:'52px', height:'52px', background:'var(--blue-500)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'var(--shadow-blue)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h1 style={{ fontFamily:'var(--font)', fontSize:'22px', fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.3px' }}>FraudLens</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'14px', marginTop:'4px' }}>Connectez-vous à votre espace</p>
        </div>

        {/* Card */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'32px', boxShadow:'var(--shadow-lg)' }}>
          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

            {error && (
              <div style={{ background:'var(--danger-bg)', border:'1px solid var(--danger-border)', borderRadius:'var(--r-md)', padding:'12px 14px', fontSize:'13px', color:'var(--danger)', display:'flex', gap:'8px', alignItems:'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'13px', fontWeight:500, color:'var(--text-primary)' }}>Adresse email</label>
              <input
                type="email" required placeholder="jean@fraudlens.ci"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                style={{ background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'11px 14px', fontSize:'14px', color:'var(--text-primary)', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s', fontFamily:'var(--font)' }}
                onFocus={e => { e.target.style.borderColor='var(--blue-500)'; e.target.style.boxShadow='0 0 0 3px rgba(59,124,244,0.12)' }}
                onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none' }}
              />
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'13px', fontWeight:500, color:'var(--text-primary)' }}>Mot de passe</label>
              <input
                type="password" required placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
                style={{ background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'11px 14px', fontSize:'14px', color:'var(--text-primary)', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s', fontFamily:'var(--font)' }}
                onFocus={e => { e.target.style.borderColor='var(--blue-500)'; e.target.style.boxShadow='0 0 0 3px rgba(59,124,244,0.12)' }}
                onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none' }}
              />
            </div>

            <button type="submit" disabled={loading}
              style={{ background:'var(--blue-500)', color:'white', border:'none', borderRadius:'var(--r-md)', padding:'12px', fontSize:'14px', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', boxShadow:'var(--shadow-blue)', fontFamily:'var(--font)' }}
              onMouseEnter={e => { if(!loading)(e.target as HTMLElement).style.background='var(--blue-600)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background='var(--blue-500)' }}
            >
              {loading ? (
                <>
                  <svg style={{ animation:'spin 0.8s linear infinite' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'20px', fontSize:'13px', color:'var(--text-secondary)' }}>
            Pas de compte ?{' '}
            <Link href="/auth/register" style={{ color:'var(--blue-500)', fontWeight:500, textDecoration:'none' }}>Créer un compte</Link>
          </p>
        </div>

        <p style={{ textAlign:'center', marginTop:'24px', fontSize:'12px', color:'var(--text-tertiary)' }}>
          FraudLens AI · Hackathon 2025
        </p>
      </div>
    </div>
  )
}
