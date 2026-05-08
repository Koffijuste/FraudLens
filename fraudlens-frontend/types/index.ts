export interface User {
  id: string
  nom: string
  email: string
  role: 'agent' | 'admin'
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
  message?: string
}

export interface Assure {
  nom: string
  telephone?: string
  numero_police: string
}

export interface FraudScore {
  _id: string
  score: number
  niveau: 'normal' | 'suspect' | 'fraude_probable'
  probabilite: number
  raisons: string[]
  flags_metier: string[]
  decision_agent: 'en_attente' | 'valide' | 'rejete'
  commentaire_agent?: string
  createdAt: string
}

export interface Document {
  nom: string
  chemin: string
  type: string
  date_upload: string
}

export type ClaimStatut = 'en_attente' | 'en_analyse' | 'approuve' | 'rejete' | 'en_investigation'
export type TypeSinistre = 'accident_auto' | 'incendie' | 'vol' | 'sante' | 'accident_moto'

export interface Claim {
  _id: string
  agent: { _id: string; nom: string; email: string }
  assure: Assure
  type_sinistre: TypeSinistre
  montant_fcfa: number
  date_sinistre: string
  description?: string
  age_compte_mois: number
  nb_sinistres_12m: number
  nb_docs_fournis: number
  delai_declaration_jours: number
  sinistres_similaires: number
  documents: Document[]
  fraud_score?: FraudScore
  statut: ClaimStatut
  createdAt: string
  updatedAt: string
}

export interface ClaimsResponse {
  success: boolean
  count: number
  total: number
  page: number
  pages: number
  claims: Claim[]
}

export interface DashboardStats {
  total: number
  en_attente: number
  en_investigation: number
  approuves: number
  rejetes: number
  taux_fraude: string
}

export interface NiveauFraude {
  _id: string
  count: number
  score_moyen: number
}

export interface Evolution {
  _id: string
  total: number
}

export interface MontantParType {
  _id: string
  total_montant: number
  count: number
}

export interface DashboardResponse {
  success: boolean
  stats: DashboardStats
  niveaux_fraude: NiveauFraude[]
  top_suspects: FraudScore[]
  evolution_7j: Evolution[]
  montant_par_type: MontantParType[]
}

export interface ApiError {
  success: false
  message: string
}
