'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, setToken, setUser } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ nom: '', email: '', password: '', role: 'agent' })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setError(''); setLoading(true)
    try {
      const res = tab === 'login'
        ? await api.login({ email: form.email, password: form.password })
        : await api.register(form)
      setToken(res.token)
      setUser(res.user)
      router.push('/dashboard')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>

      {/* Background decoration */}
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, #dbeafe 0%, transparent 70%)', opacity:.5 }} />
        <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, #eff6ff 0%, transparent 70%)', opacity:.6 }} />
      </div>

      <div className="anim-scale-in" style={{ position:'relative', zIndex:1, width:'100%', maxWidth:440 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 20px #2563eb33' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, color:'var(--text)' }}>FraudLens</span>
          </div>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Système de détection de fraude en assurance</p>
        </div>

        {/* Card */}
        <div style={{ background:'var(--bg-card)', borderRadius:var(--r-xl), border:'1px solid var(--border)', boxShadow:'var(--shadow-xl)', overflow:'hidden' }}>

          {/* Tabs */}
          <div style={{ display:'flex', borderBottom:'1px solid var(--border)' }}>
            {(['login','register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }} style={{
                flex:1, padding:'16px', border:'none', background:'transparent', cursor:'pointer',
                fontFamily:'var(--font-display)', fontWeight:600, fontSize:14, letterSpacing:'0.03em',
                textTransform:'uppercase', color: tab === t ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom:-1, transition:'all .2s'
              }}>
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ padding:'32px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {tab === 'register' && (
                <div className="anim-fade-up">
                  <Label>Nom complet</Label>
                  <input className="inp" placeholder="Kouassi Jean" value={form.nom} onChange={e => update('nom', e.target.value)} />
                </div>
              )}

              <div>
                <Label>Adresse email</Label>
                <input className="inp" type="email" placeholder="vous@fraudlens.ci" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>

              <div>
                <Label>Mot de passe</Label>
                <input className="inp" type="password" placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()} />
              </div>

              {tab === 'register' && (
                <div className="anim-fade-up anim-delay-1">
                  <Label>Rôle</Label>
                  <select className="inp" value={form.role} onChange={e => update('role', e.target.value)} style={{ cursor:'pointer' }}>
                    <option value="agent">Agent</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              )}

              {error && (
                <div style={{ background:'var(--danger-light)', border:'1px solid #fecaca', borderRadius:var(--r-md), padding:'10px 14px', color:'var(--danger)', fontSize:13, display:'flex', alignItems:'center', gap:8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button onClick={submit} disabled={loading} style={{
                width:'100%', padding:'13px', borderRadius:var(--r-md), border:'none',
                background: loading ? 'var(--text-disabled)' : 'var(--primary)',
                color:'white', fontFamily:'var(--font-display)', fontWeight:700,
                fontSize:14, letterSpacing:'0.05em', textTransform:'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 14px #2563eb44',
                transition:'all .2s', marginTop:4,
                display:'flex', alignItems:'center', justifyContent:'center', gap:8
              }}>
                {loading ? (
                  <>
                    <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid #ffffff44', borderTopColor:'white', animation:'spinRing 0.7s linear infinite' }} />
                    Connexion...
                  </>
                ) : tab === 'login' ? 'Se connecter' : 'Créer le compte'}
              </button>
            </div>
          </div>
        </div>

        {/* Demo hint */}
        <div style={{ textAlign:'center', marginTop:20, color:'var(--text-muted)', fontSize:12 }}>
          Démo : <code style={{ fontFamily:'var(--font-mono)', background:'var(--bg-subtle)', padding:'2px 6px', borderRadius:4 }}>admin@fraudlens.ci</code> / <code style={{ fontFamily:'var(--font-mono)', background:'var(--bg-subtle)', padding:'2px 6px', borderRadius:4 }}>admin123</code>
        </div>
      </div>

      <style>{`
        .inp { width:100%; padding:10px 14px; background:var(--bg-subtle); border:1.5px solid var(--border); border-radius:var(--r-md); color:var(--text); font-family:var(--font-body); font-size:14px; outline:none; transition:border-color .2s, box-shadow .2s; }
        .inp:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--blue-50); background:white; }
        .inp::placeholder { color:var(--text-disabled); }
        @keyframes spinRing { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display:'block', marginBottom:6, fontSize:13, fontWeight:500, color:'var(--text-secondary)' }}>{children}</label>
}
