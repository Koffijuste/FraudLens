'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, type CreateClaimBody } from '@/lib/api'

const TYPES = ['accident_auto','accident_moto','incendie','vol','sante']

export default function NewClaimPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nom:'', telephone:'', numero_police:'', type_sinistre:'accident_auto',
    montant_fcfa:'', date_sinistre:'', description:'',
    age_compte_mois:'', nb_sinistres_12m:'0', nb_docs_fournis:'0', sinistres_similaires:'0'
  })

  const u = (k: string, v: string) => setForm(f => ({...f,[k]:v}))

  const submit = async () => {
    setError('')
    if (!form.nom || !form.numero_police || !form.montant_fcfa || !form.date_sinistre || !form.age_compte_mois) {
      setError('Veuillez remplir tous les champs obligatoires.'); return
    }
    setLoading(true)
    try {
      const body: CreateClaimBody = {
        assure: { nom:form.nom, telephone:form.telephone, numero_police:form.numero_police },
        type_sinistre: form.type_sinistre,
        montant_fcfa: Number(form.montant_fcfa),
        date_sinistre: form.date_sinistre,
        description: form.description,
        age_compte_mois: Number(form.age_compte_mois),
        nb_sinistres_12m: Number(form.nb_sinistres_12m),
        nb_docs_fournis: Number(form.nb_docs_fournis),
        sinistres_similaires: Number(form.sinistres_similaires),
      }
      const res = await api.createClaim(body)
      router.push(`/claims/${res.claim._id}`)
    } catch(e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la création')
    } finally { setLoading(false) }
  }

  return (
    <div style={{padding:'32px',maxWidth:860,margin:'0 auto'}}>

      {/* Header */}
      <div className="anim-fade-up" style={{marginBottom:32}}>
        <button onClick={()=>router.back()} style={{display:'inline-flex',alignItems:'center',gap:6,background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:13,marginBottom:16,padding:0}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Retour
        </button>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:700,color:'var(--text)',marginBottom:4}}>Nouveau sinistre</h1>
        <p style={{color:'var(--text-muted)',fontSize:14}}>Le score de fraude sera calculé automatiquement par l'IA</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20,alignItems:'start'}}>

        {/* Main form */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>

          {/* Section assuré */}
          <Section title="Informations de l'assuré" icon="👤" delay="anim-delay-1">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Field label="Nom complet *"><input className="finp" placeholder="Konan Eric" value={form.nom} onChange={e=>u('nom',e.target.value)} /></Field>
              <Field label="Téléphone"><input className="finp" placeholder="07 00 00 00 00" value={form.telephone} onChange={e=>u('telephone',e.target.value)} /></Field>
            </div>
            <Field label="Numéro de police *"><input className="finp" placeholder="POL-2024-001" value={form.numero_police} onChange={e=>u('numero_police',e.target.value)} style={{fontFamily:'var(--font-mono)'}} /></Field>
            <Field label="Ancienneté du compte (mois) *">
              <input className="finp" type="number" min="0" placeholder="Ex: 24" value={form.age_compte_mois} onChange={e=>u('age_compte_mois',e.target.value)} />
            </Field>
          </Section>

          {/* Section sinistre */}
          <Section title="Détails du sinistre" icon="📋" delay="anim-delay-2">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Field label="Type de sinistre *">
                <select className="finp" value={form.type_sinistre} onChange={e=>u('type_sinistre',e.target.value)} style={{cursor:'pointer'}}>
                  {TYPES.map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
                </select>
              </Field>
              <Field label="Date du sinistre *"><input className="finp" type="date" value={form.date_sinistre} onChange={e=>u('date_sinistre',e.target.value)} /></Field>
            </div>
            <Field label="Montant déclaré (FCFA) *">
              <input className="finp" type="number" min="0" placeholder="Ex: 500000" value={form.montant_fcfa} onChange={e=>u('montant_fcfa',e.target.value)} style={{fontFamily:'var(--font-mono)'}} />
            </Field>
            <Field label="Description">
              <textarea className="finp" placeholder="Décrivez les circonstances du sinistre..." value={form.description} onChange={e=>u('description',e.target.value)} style={{height:90,resize:'vertical'}} />
            </Field>
          </Section>

          {/* Section IA */}
          <Section title="Données pour l'analyse IA" icon="🤖" delay="anim-delay-3">
            <div style={{background:'var(--blue-50)',border:'1px solid var(--blue-100)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'var(--primary)',marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Ces données permettent au modèle IA de calculer un score de fraude précis.
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
              <Field label="Sinistres (12 mois)">
                <input className="finp" type="number" min="0" value={form.nb_sinistres_12m} onChange={e=>u('nb_sinistres_12m',e.target.value)} />
              </Field>
              <Field label="Documents fournis">
                <input className="finp" type="number" min="0" value={form.nb_docs_fournis} onChange={e=>u('nb_docs_fournis',e.target.value)} />
              </Field>
              <Field label="Déclarations similaires">
                <input className="finp" type="number" min="0" value={form.sinistres_similaires} onChange={e=>u('sinistres_similaires',e.target.value)} />
              </Field>
            </div>
          </Section>
        </div>

        {/* Sidebar summary */}
        <div style={{position:'sticky',top:24,display:'flex',flexDirection:'column',gap:12}}>
          <div className="anim-fade-up anim-delay-2" style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,padding:'20px'}}>
            <h3 style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,color:'var(--text)',marginBottom:14}}>Résumé</h3>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {[
                { label:'Assuré', value: form.nom || '—' },
                { label:'Type', value: form.type_sinistre.replace('_',' ') },
                { label:'Montant', value: form.montant_fcfa ? Number(form.montant_fcfa).toLocaleString('fr-FR') + ' FCFA' : '—' },
                { label:'Sinistres 12m', value: form.nb_sinistres_12m || '0' },
                { label:'Ancienneté', value: form.age_compte_mois ? `${form.age_compte_mois} mois` : '—' },
              ].map(row => (
                <div key={row.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:8,borderBottom:'1px solid var(--border)'}}>
                  <span style={{fontSize:12,color:'var(--text-muted)'}}>{row.label}</span>
                  <span style={{fontSize:13,fontWeight:500,color:'var(--text)',textAlign:'right',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk preview */}
          {(Number(form.nb_sinistres_12m) >= 4 || Number(form.montant_fcfa) > 2000000 || Number(form.sinistres_similaires) >= 2) && (
            <div className="anim-scale-in" style={{background:'var(--danger-light)',border:'1px solid #fecaca',borderRadius:12,padding:'14px 16px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
                <span style={{fontSize:12,fontWeight:600,color:'var(--danger)'}}>Signaux suspects détectés</span>
              </div>
              <div style={{fontSize:11,color:'#dc2626',lineHeight:1.6}}>
                {Number(form.nb_sinistres_12m) >= 4 && <div>• {form.nb_sinistres_12m} sinistres en 12 mois</div>}
                {Number(form.montant_fcfa) > 2000000 && Number(form.age_compte_mois) < 6 && <div>• Montant élevé + compte jeune</div>}
                {Number(form.sinistres_similaires) >= 2 && <div>• {form.sinistres_similaires} déclarations similaires</div>}
              </div>
            </div>
          )}

          {error && (
            <div style={{background:'var(--danger-light)',border:'1px solid #fecaca',borderRadius:10,padding:'12px 14px',color:'var(--danger)',fontSize:13,display:'flex',gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
              {error}
            </div>
          )}

          <button onClick={submit} disabled={loading} style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:loading?'var(--text-disabled)':'var(--primary)',color:'white',fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,letterSpacing:'0.04em',textTransform:'uppercase',cursor:loading?'not-allowed':'pointer',boxShadow:loading?'none':'0 4px 14px #2563eb33',transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {loading ? (
              <><div style={{width:16,height:16,borderRadius:'50%',border:'2px solid #ffffff44',borderTopColor:'white',animation:'spinRing 0.7s linear infinite'}}/>Analyse en cours...</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Soumettre et analyser</>
            )}
          </button>
        </div>
      </div>
      <style>{`
        .finp { width:100%; padding:9px 13px; background:var(--bg-subtle); border:1.5px solid var(--border); border-radius:8px; color:var(--text); font-family:var(--font-body); font-size:13.5px; outline:none; transition:border-color .2s,box-shadow .2s; }
        .finp:focus { border-color:var(--primary); box-shadow:0 0 0 3px var(--blue-50); background:white; }
        .finp::placeholder { color:var(--text-disabled); }
        @keyframes spinRing { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  )
}

function Section({ title, icon, delay, children }: { title:string; icon:string; delay:string; children:React.ReactNode }) {
  return (
    <div className={`anim-fade-up ${delay}`} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
      <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:16}}>{icon}</span>
        <span style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,color:'var(--text)'}}>{title}</span>
      </div>
      <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',gap:12}}>{children}</div>
    </div>
  )
}

function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div>
      <label style={{display:'block',marginBottom:5,fontSize:12,fontWeight:500,color:'var(--text-secondary)'}}>{label}</label>
      {children}
    </div>
  )
}
