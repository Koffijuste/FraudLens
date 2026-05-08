'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api, getToken, type Claim } from '../../../lib/api'

export default function ClaimDetailPage() {
  const router = useRouter()
  const { id } = useParams<{id:string}>()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)
  const [decision, setDecision] = useState('')
  const [commentaire, setCommentaire] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return }
    api.getClaim(id).then(r => setClaim(r.claim)).catch(() => router.push('/claims')).finally(() => setLoading(false))
  }, [id, router])

  const submitDecision = async () => {
    if (!decision) return
    setSaving(true)
    try {
      await api.updateDecision(id, { decision, commentaire })
      setSaved(true)
      const r = await api.getClaim(id)
      setClaim(r.claim)
    } catch(e) { console.error(e) }
    finally { setSaving(false) }
  }

  if (loading) return <LoadingDetail />
  if (!claim) return null

  const fs = claim.fraud_score
  const score = fs?.score
  const scoreColor = score !== undefined ? (score >= 70 ? 'var(--danger)' : score >= 40 ? 'var(--warning)' : 'var(--success)') : '#94a3b8'
  const scoreBg = score !== undefined ? (score >= 70 ? 'var(--danger-light)' : score >= 40 ? 'var(--warning-light)' : 'var(--success-light)') : 'var(--bg-subtle)'
  const niveauLabel: Record<string,string> = { normal:'Normal', suspect:'Suspect', fraude_probable:'Fraude probable' }

  return (
    <div style={{padding:'32px',maxWidth:1100,margin:'0 auto'}}>

      {/* Header */}
      <div className="anim-fade-up" style={{marginBottom:28}}>
        <button onClick={()=>router.back()} style={{display:'inline-flex',alignItems:'center',gap:6,background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:13,marginBottom:14,padding:0}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Retour aux sinistres
        </button>
        <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:700,color:'var(--text)'}}>Dossier sinistre</h1>
          <span style={{fontFamily:'var(--font-mono)',fontSize:12,background:'var(--bg-subtle)',padding:'4px 10px',borderRadius:6,color:'var(--text-secondary)',border:'1px solid var(--border)'}}>{claim._id.slice(-8).toUpperCase()}</span>
          <StatutPill statut={claim.statut} />
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20,alignItems:'start'}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>

          {/* Assuré */}
          <InfoCard title="Assuré" icon="👤" delay="anim-delay-1">
            <Row label="Nom" value={claim.assure.nom} bold />
            <Row label="Téléphone" value={claim.assure.telephone || '—'} />
            <Row label="N° police" value={claim.assure.numero_police} mono />
            <Row label="Ancienneté" value={`${claim.age_compte_mois} mois`} />
          </InfoCard>

          {/* Sinistre */}
          <InfoCard title="Détails du sinistre" icon="📋" delay="anim-delay-2">
            <Row label="Type" value={claim.type_sinistre.replace('_',' ')} />
            <Row label="Montant" value={`${claim.montant_fcfa.toLocaleString('fr-FR')} FCFA`} bold />
            <Row label="Date" value={new Date(claim.date_sinistre).toLocaleDateString('fr-FR')} />
            <Row label="Sinistres 12m" value={String(claim.nb_sinistres_12m)} />
            {claim.description && <Row label="Description" value={claim.description} />}
          </InfoCard>

          {/* Raisons IA */}
          {fs && fs.raisons?.length > 0 && (
            <InfoCard title="Analyse IA — Raisons" icon="🔍" delay="anim-delay-3">
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {fs.raisons.map((r,i) => (
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 12px',background:score! >= 70 ? 'var(--danger-light)' : 'var(--warning-light)',borderRadius:8,border:`1px solid ${score! >= 70 ? '#fecaca' : '#fde68a'}`}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:scoreColor,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <span style={{fontSize:10,fontWeight:700,color:'white'}}>{i+1}</span>
                    </div>
                    <span style={{fontSize:13,color:'var(--text)',lineHeight:1.5}}>{r}</span>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {/* Decision */}
          <div className="anim-fade-up anim-delay-4" style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
            <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
              <span>⚖️</span>
              <span style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,color:'var(--text)'}}>Décision de l'agent</span>
            </div>
            <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',gap:12}}>
              {saved && <div style={{background:'var(--success-light)',border:'1px solid #6ee7b7',borderRadius:8,padding:'10px 14px',fontSize:13,color:'var(--success)',display:'flex',alignItems:'center',gap:8}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Décision enregistrée avec succès.
              </div>}
              <div style={{display:'flex',gap:10}}>
                {[{v:'valide',label:'Valider',color:'var(--success)',bg:'var(--success-light)',border:'#6ee7b7'},
                  {v:'rejete',label:'Rejeter',color:'var(--danger)',bg:'var(--danger-light)',border:'#fecaca'}].map(opt => (
                  <button key={opt.v} onClick={()=>setDecision(opt.v)} style={{flex:1,padding:'10px',borderRadius:9,cursor:'pointer',fontFamily:'var(--font-display)',fontWeight:600,fontSize:13,textTransform:'uppercase',letterSpacing:'0.04em',transition:'all .15s',
                    background:decision===opt.v ? opt.bg : 'var(--bg-subtle)',
                    border:`1.5px solid ${decision===opt.v ? opt.border : 'var(--border)'}`,
                    color:decision===opt.v ? opt.color : 'var(--text-muted)'}}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <textarea value={commentaire} onChange={e=>setCommentaire(e.target.value)} placeholder="Commentaire optionnel..." style={{width:'100%',padding:'10px 13px',background:'var(--bg-subtle)',border:'1.5px solid var(--border)',borderRadius:8,fontSize:13,color:'var(--text)',fontFamily:'var(--font-body)',outline:'none',resize:'vertical',height:80}} />
              <button onClick={submitDecision} disabled={!decision||saving} style={{padding:'11px',borderRadius:9,border:'none',background:!decision||saving?'var(--text-disabled)':'var(--primary)',color:'white',fontFamily:'var(--font-display)',fontWeight:700,fontSize:13,letterSpacing:'0.04em',textTransform:'uppercase',cursor:!decision||saving?'not-allowed':'pointer',transition:'all .2s',boxShadow:!decision||saving?'none':'0 4px 14px #2563eb33',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                {saving?<><div style={{width:14,height:14,borderRadius:'50%',border:'2px solid #fff4',borderTopColor:'white',animation:'spinRing .7s linear infinite'}}/>Enregistrement...</>:'Confirmer la décision'}
              </button>
            </div>
          </div>
        </div>

        {/* Score sidebar */}
        <div style={{position:'sticky',top:24,display:'flex',flexDirection:'column',gap:14}}>
          <div className="anim-scale-in" style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,padding:'24px',textAlign:'center'}}>
            <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:16,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em'}}>Score de fraude IA</p>
            {score !== undefined ? (
              <>
                <div style={{position:'relative',width:130,height:130,margin:'0 auto 16px'}}>
                  <svg viewBox="0 0 100 100" width="130" height="130">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-subtle)" strokeWidth="8"/>
                    <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="8"
                      strokeDasharray={`${2*Math.PI*42}`}
                      strokeDashoffset={`${2*Math.PI*42*(1-score/100)}`}
                      strokeLinecap="round" transform="rotate(-90 50 50)"
                      style={{transition:'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)'}}/>
                    <text x="50" y="48" textAnchor="middle" fontSize="22" fontWeight="700" fill={scoreColor} fontFamily="var(--font-display)">{score}</text>
                    <text x="50" y="62" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="var(--font-body)">/100</text>
                  </svg>
                </div>
                <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 14px',borderRadius:20,background:scoreBg,color:scoreColor,fontSize:12,fontWeight:700,fontFamily:'var(--font-mono)',marginBottom:14}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:scoreColor}}/>
                  {fs?.niveau ? niveauLabel[fs.niveau] : '—'}
                </div>
                <div style={{display:'flex',justifyContent:'center',gap:4,fontSize:11,color:'var(--text-muted)'}}>
                  Probabilité : <span style={{fontFamily:'var(--font-mono)',fontWeight:600,color:'var(--text)'}}>{fs?.probabilite !== undefined ? (fs.probabilite*100).toFixed(1)+'%' : '—'}</span>
                </div>
              </>
            ) : (
              <div style={{padding:'24px 0',color:'var(--text-muted)',fontSize:13}}>Score non calculé</div>
            )}
          </div>

          {/* Meta */}
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,padding:'16px'}}>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <MetaRow label="Agent" value={typeof claim.agent === 'object' ? claim.agent.nom : '—'} />
              <MetaRow label="Créé le" value={new Date(claim.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})} />
              <MetaRow label="Décision" value={fs?.decision_agent === 'en_attente' ? 'En attente' : fs?.decision_agent === 'valide' ? '✅ Validé' : fs?.decision_agent === 'rejete' ? '❌ Rejeté' : '—'} />
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spinRing{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function InfoCard({ title,icon,delay,children }: {title:string;icon:string;delay:string;children:React.ReactNode}) {
  return (
    <div className={`anim-fade-up ${delay}`} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
      <div style={{padding:'13px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:15}}>{icon}</span>
        <span style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,color:'var(--text)'}}>{title}</span>
      </div>
      <div style={{padding:'16px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 16px'}}>{children}</div>
    </div>
  )
}
function Row({ label,value,bold,mono }: {label:string;value:string;bold?:boolean;mono?:boolean}) {
  return (
    <div>
      <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:2}}>{label}</div>
      <div style={{fontSize:13,fontWeight:bold?600:400,color:'var(--text)',fontFamily:mono?'var(--font-mono)':'var(--font-body)'}}>{value}</div>
    </div>
  )
}
function MetaRow({ label,value }: {label:string;value:string}) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:8,borderBottom:'1px solid var(--border)'}}>
      <span style={{fontSize:12,color:'var(--text-muted)'}}>{label}</span>
      <span style={{fontSize:12,fontWeight:500,color:'var(--text)'}}>{value}</span>
    </div>
  )
}
function StatutPill({ statut }: {statut:string}) {
  const cfg: Record<string,{bg:string;color:string}> = {
    en_attente:{bg:'#f1f5f9',color:'#64748b'}, en_analyse:{bg:'var(--blue-50)',color:'var(--primary)'},
    en_investigation:{bg:'var(--danger-light)',color:'var(--danger)'}, approuve:{bg:'var(--success-light)',color:'var(--success)'},
    rejete:{bg:'var(--danger-light)',color:'var(--danger)'},
  }
  const c = cfg[statut] ?? {bg:'#f1f5f9',color:'#64748b'}
  return <span style={{padding:'4px 12px',borderRadius:20,background:c.bg,color:c.color,fontSize:12,fontWeight:600,fontFamily:'var(--font-mono)'}}>{statut.replace('_',' ')}</span>
}
function LoadingDetail() {
  return (
    <div style={{padding:'32px',maxWidth:1100,margin:'0 auto'}}>
      <div className="skeleton" style={{width:180,height:20,marginBottom:24}}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {[120,150,100].map((h,i) => <div key={i} className="skeleton" style={{height:h}}/>)}
        </div>
        <div className="skeleton" style={{height:280}}/>
      </div>
    </div>
  )
}
