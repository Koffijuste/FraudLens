'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api, getToken, type Claim } from '../../lib/api'

const STATUTS = [
  { value:'', label:'Tous' },
  { value:'en_attente', label:'En attente' },
  { value:'en_analyse', label:'En analyse' },
  { value:'en_investigation', label:'Investigation' },
  { value:'approuve', label:'Approuvé' },
  { value:'rejete', label:'Rejeté' },
]

const NIVEAUX = [
  { value:'', label:'Tous niveaux' },
  { value:'normal', label:'Normal' },
  { value:'suspect', label:'Suspect' },
  { value:'fraude_probable', label:'Fraude probable' },
]

function StatusBadge({ statut }: { statut: string }) {
  const cfg: Record<string, {bg:string;color:string;label:string}> = {
    en_attente:       {bg:'#f1f5f9',color:'#64748b',label:'En attente'},
    en_analyse:       {bg:'var(--blue-50)',color:'var(--primary)',label:'En analyse'},
    en_investigation: {bg:'var(--danger-light)',color:'var(--danger)',label:'Investigation'},
    approuve:         {bg:'var(--success-light)',color:'var(--success)',label:'Approuvé'},
    rejete:           {bg:'#fef2f2',color:'#dc2626',label:'Rejeté'},
  }
  const c = cfg[statut] ?? {bg:'#f1f5f9',color:'#64748b',label:statut}
  return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:20,background:c.bg,color:c.color,fontSize:11,fontWeight:600,fontFamily:'var(--font-mono)'}}><span style={{width:5,height:5,borderRadius:'50%',background:c.color}}/>{c.label}</span>
}

function ScoreGauge({ score }: { score?: number }) {
  if (score === undefined) return <span style={{color:'var(--text-muted)',fontSize:13}}>—</span>
  const color = score >= 70 ? 'var(--danger)' : score >= 40 ? 'var(--warning)' : 'var(--success)'
  const bg = score >= 70 ? 'var(--danger-light)' : score >= 40 ? 'var(--warning-light)' : 'var(--success-light)'
  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <div style={{flex:1,height:5,background:'#f1f5f9',borderRadius:3,overflow:'hidden',width:60}}>
        <div style={{height:'100%',borderRadius:3,background:color,width:`${score}%`,transition:'width .5s'}}/>
      </div>
      <span style={{fontFamily:'var(--font-mono)',fontSize:12,fontWeight:600,color,background:bg,padding:'2px 7px',borderRadius:6}}>{score}</span>
    </div>
  )
}

export default function ClaimsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statut, setStatut] = useState(searchParams.get('statut') ?? '')
  const [niveau, setNiveau] = useState('')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string,string> = { page: String(page), limit:'10' }
      if (statut) params.statut = statut
      if (niveau) params.niveau = niveau
      const res = await api.getClaims(params)
      setClaims(res.claims)
      setTotal(res.total)
    } catch { router.push('/login') }
    finally { setLoading(false) }
  }, [page, statut, niveau, router])

  useEffect(() => { if (!getToken()) { router.push('/login'); return } load() }, [load, router])

  const filtered = search ? claims.filter(c =>
    c.assure.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.assure.numero_police.toLowerCase().includes(search.toLowerCase())
  ) : claims

  return (
    <div style={{padding:'32px',maxWidth:1400,margin:'0 auto'}}>

      {/* Header */}
      <div className="anim-fade-up" style={{marginBottom:28,display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:700,color:'var(--text)',marginBottom:4}}>Sinistres</h1>
          <p style={{color:'var(--text-muted)',fontSize:14}}>{total} dossier{total > 1 ? 's' : ''} au total</p>
        </div>
        <Link href="/claims/new" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',background:'var(--primary)',color:'white',borderRadius:10,textDecoration:'none',fontFamily:'var(--font-display)',fontWeight:600,fontSize:13,letterSpacing:'0.04em',boxShadow:'0 4px 14px #2563eb33'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouveau sinistre
        </Link>
      </div>

      {/* Filters */}
      <div className="anim-fade-up anim-delay-1" style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,padding:'16px 20px',marginBottom:16,display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{flex:1,minWidth:200,position:'relative'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Rechercher assuré, numéro police..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:'100%',padding:'8px 12px 8px 36px',background:'var(--bg-subtle)',border:'1.5px solid var(--border)',borderRadius:8,fontSize:13,color:'var(--text)',outline:'none',fontFamily:'var(--font-body)'}} />
        </div>
        <select value={statut} onChange={e=>{setStatut(e.target.value);setPage(1)}}
          style={{padding:'8px 12px',background:'var(--bg-subtle)',border:'1.5px solid var(--border)',borderRadius:8,fontSize:13,color:'var(--text)',outline:'none',cursor:'pointer'}}>
          {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={niveau} onChange={e=>{setNiveau(e.target.value);setPage(1)}}
          style={{padding:'8px 12px',background:'var(--bg-subtle)',border:'1.5px solid var(--border)',borderRadius:8,fontSize:13,color:'var(--text)',outline:'none',cursor:'pointer'}}>
          {NIVEAUX.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="anim-fade-up anim-delay-2" style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'var(--bg-subtle)',borderBottom:'1px solid var(--border)'}}>
                {['Assuré','Numéro police','Type','Montant FCFA','Score IA','Statut','Date','Actions'].map(h => (
                  <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i}>
                    {[1,2,3,4,5,6,7,8].map(j => (
                      <td key={j} style={{padding:'14px 16px'}}>
                        <div className="skeleton" style={{height:16,width:'80%'}}/>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{padding:'48px',textAlign:'center',color:'var(--text-muted)',fontSize:14}}>Aucun sinistre trouvé</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c._id} style={{borderBottom:'1px solid var(--border)',transition:'background .15s',animationDelay:`${i*0.03}s`}}
                  onMouseEnter={e=>(e.currentTarget.style.background='var(--bg-subtle)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td style={{padding:'13px 16px'}}>
                    <div style={{fontWeight:600,fontSize:14,color:'var(--text)'}}>{c.assure.nom}</div>
                    <div style={{fontSize:11,color:'var(--text-muted)'}}>{c.assure.telephone}</div>
                  </td>
                  <td style={{padding:'13px 16px',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-secondary)'}}>{c.assure.numero_police}</td>
                  <td style={{padding:'13px 16px',fontSize:13,color:'var(--text-secondary)',textTransform:'capitalize'}}>{c.type_sinistre.replace('_',' ')}</td>
                  <td style={{padding:'13px 16px',fontFamily:'var(--font-mono)',fontSize:13,fontWeight:500,color:'var(--text)'}}>{c.montant_fcfa.toLocaleString('fr-FR')}</td>
                  <td style={{padding:'13px 16px'}}><ScoreGauge score={c.fraud_score?.score} /></td>
                  <td style={{padding:'13px 16px'}}><StatusBadge statut={c.statut} /></td>
                  <td style={{padding:'13px 16px',fontSize:12,color:'var(--text-muted)'}}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td style={{padding:'13px 16px'}}>
                    <Link href={`/claims/${c._id}`} style={{display:'inline-flex',alignItems:'center',gap:4,padding:'6px 12px',background:'var(--blue-50)',color:'var(--primary)',borderRadius:7,textDecoration:'none',fontSize:12,fontWeight:500,transition:'all .15s'}}
                      onMouseEnter={e=>(e.currentTarget.style.background='var(--blue-100)')}
                      onMouseLeave={e=>(e.currentTarget.style.background='var(--blue-50)')}>
                      Voir
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 10 && (
          <div style={{padding:'14px 20px',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:13,color:'var(--text-muted)'}}>Page {page} sur {Math.ceil(total/10)}</span>
            <div style={{display:'flex',gap:6}}>
              {[...Array(Math.ceil(total/10))].slice(0,5).map((_,i) => (
                <button key={i} onClick={()=>setPage(i+1)} style={{width:32,height:32,borderRadius:7,border:'1px solid',borderColor:page===i+1?'var(--primary)':'var(--border)',background:page===i+1?'var(--primary)':'transparent',color:page===i+1?'white':'var(--text-secondary)',fontSize:13,cursor:'pointer',fontWeight:500}}>
                  {i+1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
