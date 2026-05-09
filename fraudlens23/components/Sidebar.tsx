'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearToken, getUser } from '@/lib/api'
import { useTheme } from '@/lib/theme'

const NAV = [
  {
    href: '/dashboard', label: 'Tableau de bord',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  },
  {
    href: '/claims', label: 'Sinistres',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  },
  {
    href: '/claims/new', label: 'Nouveau sinistre',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = getUser()
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  const logout = () => {
    clearToken()
    localStorage.removeItem('fraudlens_user')
    router.push('/login')
  }

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
      boxShadow: 'var(--shadow)',
    }}>

      {/* Logo */}
      <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px #2563eb44', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', lineHeight: 1.2 }}>FraudLens</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Détection IA</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-disabled)', letterSpacing: '0.09em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 6 }}>Menu</div>
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px',
              borderRadius: 9, textDecoration: 'none', fontSize: 13.5, fontWeight: active ? 600 : 400,
              background: active ? 'var(--primary-light)' : 'transparent',
              color: active ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'background .15s, color .15s',
              borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Dark/Light toggle */}
      <div style={{ padding: '0 10px 10px' }}>
        <button onClick={toggle} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 12px', borderRadius: 10,
          background: isDark ? 'var(--bg-subtle)' : 'var(--bg-subtle)',
          border: '1px solid var(--border)', cursor: 'pointer', transition: 'all .2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15 }}>{isDark ? '☀️' : '🌙'}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{isDark ? 'Mode clair' : 'Mode sombre'}</span>
          </div>

          {/* Toggle pill */}
          <div style={{
            width: 36, height: 20, borderRadius: 10, position: 'relative', flexShrink: 0,
            background: isDark ? 'var(--primary)' : 'var(--border)', transition: 'background .25s',
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 3, transition: 'left .25s',
              left: isDark ? 19 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
        </button>
      </div>

      {/* User */}
      <div style={{ padding: '10px 10px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 11px', borderRadius: 10, background: 'var(--bg-subtle)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{user?.nom?.[0]?.toUpperCase() ?? 'U'}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nom ?? 'Utilisateur'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role ?? 'agent'}</div>
          </div>
          <button onClick={logout} title="Déconnexion"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
