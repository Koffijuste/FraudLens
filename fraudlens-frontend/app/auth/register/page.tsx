'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ nom:'', email:'', password:'', role:'agent' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await register(form.nom, form.email, form.password, form.role)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte')
    } finally { setLoading(false) }
  }

  const inputStyle = { background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'11px 14px', fontSize:'14px', color:'var(--text-primary)', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s', fontFamily:'var(--font)', width:'100%' }
  const focusStyle = { borderColor:'var(--blue-500)', boxShadow:'0 0 0 3px rgba(59,124,244,0.12)' }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'420px' }} className="anim-scale-in">

        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ width:'52px', height:'52px', background:'var(--blue-500)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'var(--shadow-blue)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.3px' }}>Créer un compte</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'14px', marginTop:'4px' }}>Rejoignez FraudLens</p>
        </div>

        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'32px', boxShadow:'var(--shadow-lg)' }}>
          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            {error && (
              <div style={{ background:'var(--danger-bg)', border:'1px solid var(--danger-border)', borderRadius:'var(--r-md)', padding:'12px 14px', fontSize:'13px', color:'var(--danger)' }}>{error}</div>
            )}

            {[
              { key:'nom', label:'Nom complet', type:'text', placeholder:'Kouassi Jean' },
              { key:'email', label:'Email', type:'email', placeholder:'jean@fraudlens.ci' },
              { key:'password', label:'Mot de passe', type:'password', placeholder:'6 caractères minimum' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <label style={{ fontSize:'13px', fontWeight:500, color:'var(--text-primary)' }}>{label}</label>
                <input type={type} required placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none' }}
                />
              </div>
            ))}

            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'13px', fontWeight:500, color:'var(--text-primary)' }}>Rôle</label>
              <select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}
                style={{ ...inputStyle, cursor:'pointer' }}>
                <option value="agent">Agent</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <button type="submit" disabled={loading}
              style={{ background:'var(--blue-500)', color:'white', border:'none', borderRadius:'var(--r-md)', padding:'12px', fontSize:'14px', fontWeight:600, cursor: loading ? 'not-allowed':'pointer', opacity: loading ? 0.7:1, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', boxShadow:'var(--shadow-blue)', fontFamily:'var(--font)', marginTop:'4px' }}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'20px', fontSize:'13px', color:'var(--text-secondary)' }}>
            Déjà un compte ?{' '}
            <Link href="/auth/login" style={{ color:'var(--blue-500)', fontWeight:500, textDecoration:'none' }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
