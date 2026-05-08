import { ClaimStatut, TypeSinistre } from '@/types'

export const formatFCFA = (amount: number) =>
  new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount)

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))

export const formatDateRelative = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `il y a ${mins} min`
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${days}j`
}

export const getScoreColor = (score: number) => {
  if (score >= 70) return '#ef4444'
  if (score >= 40) return '#f59e0b'
  return '#10b981'
}

export const getScoreLabel = (score: number) => {
  if (score >= 70) return 'Fraude probable'
  if (score >= 40) return 'Suspect'
  return 'Normal'
}

export const getScoreBg = (score: number) => {
  if (score >= 70) return { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' }
  if (score >= 40) return { bg: '#fffbeb', color: '#f59e0b', border: '#fde68a' }
  return { bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0' }
}

export const statutLabels: Record<ClaimStatut, { label: string; color: string; bg: string; border: string }> = {
  en_attente:      { label: 'En attente',      color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
  en_analyse:      { label: 'En analyse',      color: '#3b7cf4', bg: '#eff5ff', border: '#bfdbfe' },
  approuve:        { label: 'Approuvé',         color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  rejete:          { label: 'Rejeté',           color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  en_investigation:{ label: 'Investigation',    color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
}

export const typeLabels: Record<TypeSinistre, string> = {
  accident_auto:  'Accident auto',
  incendie:       'Incendie',
  vol:            'Vol',
  sante:          'Santé',
  accident_moto:  'Accident moto',
}

export const typeIcons: Record<TypeSinistre, string> = {
  accident_auto:  '🚗',
  incendie:       '🔥',
  vol:            '🔓',
  sante:          '🏥',
  accident_moto:  '🛵',
}
