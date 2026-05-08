'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, getToken, type DashboardData } from '../../lib/api'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = { normal:'#10b981', suspect:'#f59e0b', fraude_probable:'#ef4444' }

function ScoreBadge({ niveau }: { niveau: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    normal:         { bg:'var(--success-light)', color:'var(--success)',  label:'Normal' },
    suspect:        { bg:'var(--warning-light)', color:'var(--warning)',  label:'Suspect' },
    fraude_probable:{ bg:'var(--danger-light)',  color:'var(--danger)',   label:'Fraude probable' },
  }
  const c = cfg[niveau] ?? cfg.normal
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color, fontSize:11, fontWeight:600, fontFamily:'var(--font-mono)' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:c.color }} />
      {c.label}
    </span>
  )
}

function StatCard({ label, value, icon, color, delay, sub }: { label:string; value:string|number; icon:React.ReactNode; color:string; delay:string; sub?:string }) {
  return (
    <div className={`anim-fade-up ${delay}`} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'20px 24px', display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:500 }}>{label}</span>
        <div style={{ width:36, height:36, borderRadius:10, background:color+'15', display:'flex', alignItems:'center', justifyContent:'center', color }}>{icon}</div>
      </div>
      <div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:700, color:'var(--text)', lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{sub}</div>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return }
    api.getDashboard()
      .then(setData)
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <LoadingScreen />
  if (!data) return null
  const { stats, niveaux_fraude, top_suspects, evolution_7j, montant_par_type } = data

  const pieData = niveaux_fraude.map(n => ({
    name: n._id === 'fraude_probable' ? 'Fraude' : n._id === 'suspect' ? 'Suspect' : 'Normal',
    value: n.count,
    color: COLORS[n._id as keyof typeof COLORS] ?? '#94a3b8'
  }))

  const barData = montant_par_type.map(m => ({
    name: m._id.replace('_', ' '),
    montant: Math.round(m.total_montant / 1000),
    count: m.count
  }))

  return (
    <div style={{ padding:'32px', maxWidth:1400, margin:'0 auto' }}>

      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom:32, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, color:'var(--text)', marginBottom:4 }}>Tableau de bord</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>{new Date().toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <Link href="/claims/new" style={{
          display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px',
          background:'var(--primary)', color:'white', borderRadius:10, textDecoration:'none',
          fontFamily:'var(--font-display)', fontWeight:600, fontSize:13, letterSpacing:'0.04em',
          boxShadow:'0 4px 14px #2563eb33', transition:'all .2s'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouveau sinistre
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
        <StatCard label="Total sinistres" value={stats.total} delay="anim-delay-1" color="#2563eb"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} />
        <StatCard label="En investigation" value={stats.en_investigation} delay="anim-delay-2" color="#ef4444" sub="Fraudes probables"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
        <StatCard label="Approuvés" value={stats.approuves} delay="anim-delay-3" color="#10b981"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} />
        <StatCard label="Taux de fraude" value={`${stats.taux_fraude}%`} delay="anim-delay-4" color="#f59e0b" sub="Sur total déclarations"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>} />
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 340px', gap:16, marginBottom:28 }}>

        {/* Area chart - évolution */}
        <div className="anim-fade-up anim-delay-2" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ marginBottom:16 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, color:'var(--text)' }}>Évolution — 7 derniers jours</h2>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Sinistres déclarés par jour</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={evolution_7j} margin={{ top:0, right:0, bottom:0, left:-20 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="_id" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:'white', border:'1px solid #e2e8f0', borderRadius:8, fontSize:12 }} />
              <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} fill="url(#grad)" dot={{ fill:'#2563eb', strokeWidth:0, r:3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart - montants */}
        <div className="anim-fade-up anim-delay-3" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ marginBottom:16 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, color:'var(--text)' }}>Montants par type</h2>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>En milliers de FCFA</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} margin={{ top:0, right:0, bottom:0, left:-20 }}>
              <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:'white', border:'1px solid #e2e8f0', borderRadius:8, fontSize:12 }} formatter={(v) => [`${v}k FCFA`]} />
              <Bar dataKey="montant" fill="#bfdbfe" radius={[4,4,0,0]}>
                {barData.map((_, i) => <Cell key={i} fill={i === 0 ? '#2563eb' : '#93c5fd'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart - niveaux */}
        <div className="anim-fade-up anim-delay-4" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ marginBottom:12 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, color:'var(--text)' }}>Répartition IA</h2>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Niveaux de fraude détectés</p>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background:'white', border:'1px solid #e2e8f0', borderRadius:8, fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
            {pieData.map(p => (
              <div key={p.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:p.color }} />
                  <span style={{ fontSize:12, color:'var(--text-secondary)' }}>{p.name}</span>
                </div>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--text)', fontFamily:'var(--font-mono)' }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top suspects */}
      <div className="anim-fade-up anim-delay-5" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, color:'var(--text)' }}>Cas les plus suspects</h2>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Top 5 par score de fraude</p>
          </div>
          <Link href="/claims?statut=en_investigation" style={{ fontSize:13, color:'var(--primary)', textDecoration:'none', fontWeight:500 }}>Voir tout →</Link>
        </div>
        <div>
          {top_suspects.length === 0 ? (
            <div style={{ padding:'40px 24px', textAlign:'center', color:'var(--text-muted)', fontSize:14 }}>Aucun cas suspect pour l'instant</div>
          ) : top_suspects.map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 24px', borderBottom: i < top_suspects.length - 1 ? '1px solid var(--border)' : 'none', transition:'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

              {/* Score circle */}
              <div style={{ width:44, height:44, borderRadius:'50%', background: s.score >= 70 ? 'var(--danger-light)' : 'var(--warning-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:13, color: s.score >= 70 ? 'var(--danger)' : 'var(--warning)' }}>{s.score}</span>
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:14, color:'var(--text)', marginBottom:2 }}>{s.claim?.assure?.nom ?? 'Inconnu'}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.raisons?.[0] ?? '—'}</div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
                <ScoreBadge niveau={s.niveau} />
                <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
                  {s.claim?.montant_fcfa ? s.claim.montant_fcfa.toLocaleString('fr-FR') + ' FCFA' : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ padding:'32px' }}>
      <div style={{ marginBottom:32 }}>
        <div className="skeleton" style={{ width:220, height:28, marginBottom:8 }} />
        <div className="skeleton" style={{ width:160, height:16 }} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:100 }} />)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 340px', gap:16 }}>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:260 }} />)}
      </div>
    </div>
  )
}
