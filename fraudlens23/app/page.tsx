'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getToken } from '@/lib/api'
import { useTheme } from '@/lib/theme'

const FEATURES = [
  {
    icon: '🤖',
    title: 'IA Random Forest',
    desc: 'Modèle entraîné sur des milliers de sinistres pour détecter les patterns frauduleux avec précision.',
    color: '#2563eb',
    bg: '#eff6ff',
    darkBg: '#172554',
  },
  {
    icon: '⚡',
    title: 'Score en temps réel',
    desc: 'Chaque déclaration reçoit un score de 0 à 100 avec les raisons détaillées en moins d\'une seconde.',
    color: '#f59e0b',
    bg: '#fffbeb',
    darkBg: '#2d2208',
  },
  {
    icon: '📊',
    title: 'Dashboard analytique',
    desc: 'Visualisez les tendances, comparez les types de sinistres et suivez l\'évolution des fraudes.',
    color: '#10b981',
    bg: '#ecfdf5',
    darkBg: '#052e16',
  },
  {
    icon: '🔐',
    title: 'Sécurité JWT',
    desc: 'Authentification sécurisée, mots de passe chiffrés bcrypt, rôles agents et administrateurs.',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    darkBg: '#2e1065',
  },
  {
    icon: '🌍',
    title: 'Contexte local CI',
    desc: 'Calibré pour le marché ivoirien : montants en FCFA, types de sinistres locaux, seuils adaptés.',
    color: '#ef4444',
    bg: '#fef2f2',
    darkBg: '#2d1b1b',
  },
  {
    icon: '🔍',
    title: 'IA explicable',
    desc: 'L\'IA ne dit pas seulement "fraude" — elle explique pourquoi avec des raisons lisibles par l\'humain.',
    color: '#06b6d4',
    bg: '#ecfeff',
    darkBg: '#0c2a31',
  },
]

const STATS = [
  { value: '94%', label: 'Précision du modèle', icon: '🎯' },
  { value: '<1s', label: 'Temps d\'analyse', icon: '⚡' },
  { value: '5', label: 'Types de sinistres', icon: '📋' },
  { value: '100', label: 'Score max fraude', icon: '📊' },
]

const STEPS = [
  { num: '01', title: 'L\'agent soumet un sinistre', desc: 'Formulaire simple avec les informations de l\'assuré et les détails du sinistre.' },
  { num: '02', title: 'L\'IA analyse en temps réel', desc: 'Le modèle Random Forest calcule un score de fraude et identifie les signaux suspects.' },
  { num: '03', title: 'Le résultat s\'affiche', desc: 'Score 0→100, niveau de risque, raisons détaillées et recommandation d\'action.' },
  { num: '04', title: 'L\'agent prend sa décision', desc: 'Valider, rejeter ou ouvrir une investigation avec commentaire enregistré.' },
]

export default function LandingPage() {
  const { theme, toggle } = useTheme()
  const [isLogged, setIsLogged] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isDark = theme === 'dark'

  useEffect(() => {
    setIsLogged(!!getToken())
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? (isDark ? 'rgba(15,17,23,0.92)' : 'rgba(255,255,255,0.92)') : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all .3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px #2563eb44' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>FraudLens</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Theme toggle */}
            <button onClick={toggle} title={isDark ? 'Mode clair' : 'Mode sombre'}
              style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'all .2s' }}>
              {isDark ? '☀️' : '🌙'}
            </button>

            {isLogged ? (
              <Link href="/dashboard" style={{ padding: '8px 18px', borderRadius: 9, background: 'var(--primary)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 13, fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 14px #2563eb33' }}>
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', textDecoration: 'none', fontWeight: 500, fontSize: 13 }}>
                  Connexion
                </Link>
                <Link href="/login" style={{ padding: '8px 18px', borderRadius: 9, background: 'var(--primary)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 13, fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 14px #2563eb33' }}>
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: 'center', position: 'relative', overflow: 'hidden', maxWidth: 1200, margin: '0 auto', padding: '140px 32px 100px' }}>

        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: 60, left: '10%', width: 400, height: 400, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,#1e3a5f55 0%,transparent 70%)' : 'radial-gradient(circle,#dbeafe 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 120, right: '8%', width: 300, height: 300, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,#05212655 0%,transparent 70%)' : 'radial-gradient(circle,#ecfeff 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div className="anim-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: isDark ? '#1e3a5f' : '#dbeafe', border: '1px solid var(--blue-200)', marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', animation: 'pulseDot 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.04em' }}>HACKATHON 2025 — CÔTE D'IVOIRE</span>
          </div>

          {/* Title */}
          <h1 className="anim-fade-up anim-delay-1" style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, lineHeight: 1.15, marginBottom: 22,
            fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--text)',
          }}>
            Détectez la fraude<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%', animation: 'gradShift 4s ease infinite',
            }}>avant qu'elle coûte</span>
          </h1>

          {/* Subtitle */}
          <p className="anim-fade-up anim-delay-2" style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7 }}>
            FraudLens analyse chaque déclaration de sinistre en temps réel grâce à l'IA et attribue un score de fraude précis avec explications.
          </p>

          {/* CTAs */}
          <div className="anim-fade-up anim-delay-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{
              padding: '14px 32px', borderRadius: 12, background: 'var(--primary)', color: 'white',
              textDecoration: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
              fontSize: 15, letterSpacing: '0.03em', boxShadow: '0 8px 24px #2563eb44',
              display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all .2s',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Accéder à la plateforme
            </Link>
            <a href="#features" style={{
              padding: '14px 28px', borderRadius: 12, border: '1.5px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text)', textDecoration: 'none',
              fontWeight: 600, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all .2s',
            }}>
              Découvrir →
            </a>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>
        <div className="anim-fade-up anim-delay-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ ...card, padding: '24px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 32, color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 32px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="anim-fade-up" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 36, color: 'var(--text)', marginBottom: 12 }}>
            Tout ce dont vous avez besoin
          </h2>
          <p className="anim-fade-up anim-delay-1" style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Une plateforme complète de bout en bout, du formulaire à la décision finale.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 18 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className={`anim-fade-up anim-delay-${i + 1}`} style={{ ...card, padding: '24px', boxShadow: 'var(--shadow)', transition: 'transform .2s, box-shadow .2s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: isDark ? f.darkBg : f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ background: isDark ? 'var(--bg-card)' : '#f0f7ff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 className="anim-fade-up" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 34, color: 'var(--text)', marginBottom: 10 }}>Comment ça marche ?</h2>
            <p className="anim-fade-up anim-delay-1" style={{ color: 'var(--text-secondary)', fontSize: 15 }}>4 étapes simples de la déclaration à la décision</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
            {STEPS.map((s, i) => (
              <div key={i} className={`anim-fade-up anim-delay-${i + 1}`} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 18, margin: '0 auto 14px', boxShadow: '0 4px 14px #2563eb44' }}>{s.num}</div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
        <div className="anim-scale-in" style={{
          background: 'linear-gradient(135deg, var(--primary), #0ea5e9)',
          borderRadius: 24, padding: '56px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 40px #2563eb33',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -30, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 32, color: 'white', marginBottom: 14 }}>
              Prêt à protéger votre portefeuille ?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
              Créez votre compte en 30 secondes et commencez à détecter les fraudes instantanément.
            </p>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 12, background: 'white',
              color: 'var(--primary)', textDecoration: 'none',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 15,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'all .2s',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Créer mon compte gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>FraudLens</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hackathon 2025 — Côte d'Ivoire · Détection de fraude IA</span>
          <button onClick={toggle} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>
            {isDark ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
      `}</style>
    </div>
  )
}
