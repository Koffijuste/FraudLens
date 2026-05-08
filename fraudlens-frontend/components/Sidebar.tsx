'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearToken, getUser } from '@/lib/api'

const nav = [
  { href:'/dashboard', label:'Tableau de bord', icon:(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )},
  { href:'/claims', label:'Sinistres', icon:(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )},
  { href:'/claims/new', label:'Nouveau sinistre', icon:(
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  )},
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = getUser()

  const logout = () => { clearToken(); localStorage.removeItem('fraudlens_user'); router.push('/login') }

  return (
    <aside style={{
      width:240, minHeight:'100vh', background:'var(--bg-card)',
      borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column',
      position:'sticky', top:0, height:'100vh', flexShrink:0
    }}>
      {/* Logo */}
      <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px #2563eb33', flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, color:'var(--text)', lineHeight:1.2 }}>FraudLens</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', letterSpacing:'0.04em' }}>DÉTECTION IA</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:2 }}>
        <div style={{ fontSize:11, fontWeight:600, color:'var(--text-disabled)', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0 8px', marginBottom:8 }}>Navigation</div>
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
              borderRadius:var(--r-md), textDecoration:'none', transition:'all .15s',
              background: active ? 'var(--blue-50)' : 'transparent',
              color: active ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: active ? 600 : 400, fontSize:14,
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ flexShrink:0 }}>{item.icon}</span>
              {item.label}
              {active && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'var(--primary)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ padding:'16px 12px', borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:var(--r-md), background:'var(--bg-subtle)' }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--blue-100)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--primary)' }}>{user?.nom?.[0]?.toUpperCase() ?? 'U'}</span>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.nom ?? 'Utilisateur'}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'capitalize' }}>{user?.role ?? 'agent'}</div>
          </div>
          <button onClick={logout} title="Déconnexion" style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4, borderRadius:6, transition:'color .15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)') }
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)') }>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
