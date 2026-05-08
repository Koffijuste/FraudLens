const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('fraudlens_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Erreur serveur')
  return data
}

export const api = {
  login: (body: { email: string; password: string }) =>
    request<{ success: boolean; token: string; user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body: { nom: string; email: string; password: string; role: string }) =>
    request<{ success: boolean; token: string; user: User }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request<{ success: boolean; user: User }>('/api/auth/me'),
  getClaims: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<ClaimsResponse>(`/api/claims${qs}`)
  },
  getClaim: (id: string) => request<{ success: boolean; claim: Claim }>(`/api/claims/${id}`),
  createClaim: (body: CreateClaimBody) =>
    request<{ success: boolean; claim: Claim }>('/api/claims', { method: 'POST', body: JSON.stringify(body) }),
  updateDecision: (id: string, body: { decision: string; commentaire: string }) =>
    request<{ success: boolean }>(`/api/claims/${id}/decision`, { method: 'PATCH', body: JSON.stringify(body) }),
  getDashboard: () => request<DashboardData>('/api/dashboard'),
}

export interface User { id: string; nom: string; email: string; role: string }
export interface FraudScore {
  _id: string; score: number; niveau: 'normal' | 'suspect' | 'fraude_probable';
  probabilite: number; raisons: string[]; flags_metier: string[];
  decision_agent: 'en_attente' | 'valide' | 'rejete'; commentaire_agent?: string;
}
export interface Claim {
  _id: string; assure: { nom: string; telephone: string; numero_police: string };
  type_sinistre: string; montant_fcfa: number; date_sinistre: string;
  description?: string; statut: string; fraud_score?: FraudScore;
  agent: { nom: string; email: string }; createdAt: string;
  age_compte_mois: number; nb_sinistres_12m: number;
}
export interface ClaimsResponse { success: boolean; claims: Claim[]; total: number; page: number; pages: number; count: number }
export interface DashboardData {
  success: boolean;
  stats: { total: number; en_attente: number; en_investigation: number; approuves: number; rejetes: number; taux_fraude: string };
  niveaux_fraude: { _id: string; count: number; score_moyen: number }[];
  top_suspects: { score: number; niveau: string; raisons: string[]; claim: Claim }[];
  evolution_7j: { _id: string; total: number }[];
  montant_par_type: { _id: string; total_montant: number; count: number }[];
}
export interface CreateClaimBody {
  assure: { nom: string; telephone: string; numero_police: string };
  type_sinistre: string; montant_fcfa: number; date_sinistre: string;
  description?: string; age_compte_mois: number; nb_sinistres_12m: number;
  nb_docs_fournis: number; sinistres_similaires: number;
}
export function setToken(t: string) { localStorage.setItem('fraudlens_token', t) }
export function clearToken() { localStorage.removeItem('fraudlens_token') }
export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem('fraudlens_user')
  return u ? JSON.parse(u) : null
}
export function setUser(u: User) { localStorage.setItem('fraudlens_user', JSON.stringify(u)) }
