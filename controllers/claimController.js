const axios = require('axios')
const Claim = require('../models/Claim')
const FraudScore = require('../models/FraudScore')

// Règles métier avant appel IA
const checkReglesMetier = (data) => {
  const flags = []
  if (data.nb_sinistres_12m >= 4)
    flags.push(`${data.nb_sinistres_12m} sinistres en 12 mois`)
  if (data.montant_fcfa > 2000000 && data.age_compte_mois < 6)
    flags.push(`Gros montant (${data.montant_fcfa.toLocaleString()} FCFA) sur compte jeune`)
  if (data.sinistres_similaires >= 2)
    flags.push(`${data.sinistres_similaires} déclarations similaires détectées`)
  if (data.nb_docs_fournis <= 1 && data.montant_fcfa > 1000000)
    flags.push(`Documents insuffisants pour ce montant`)
  if (data.delai_declaration_jours > 60)
    flags.push(`Déclaration tardive (${data.delai_declaration_jours} jours)`)
  return flags
}

// POST /api/claims — Soumettre un sinistre
const createClaim = async (req, res) => {
  try {
    const {
      assure, type_sinistre, montant_fcfa, date_sinistre, description,
      age_compte_mois, nb_sinistres_12m, nb_docs_fournis,
      delai_declaration_jours, sinistres_similaires
    } = req.body

    // Calcul du délai si date fournie
    const dateSinistre = new Date(date_sinistre)
    const delai = delai_declaration_jours ||
      Math.floor((Date.now() - dateSinistre) / (1000 * 60 * 60 * 24))

    // Documents uploadés
    const documents = (req.files || []).map(f => ({
      nom: f.originalname,
      chemin: f.path,
      type: f.mimetype
    }))

    const claimData = {
      agent: req.user._id,
      assure,
      type_sinistre,
      montant_fcfa: Number(montant_fcfa),
      date_sinistre: dateSinistre,
      description,
      age_compte_mois: Number(age_compte_mois),
      nb_sinistres_12m: Number(nb_sinistres_12m) || 0,
      nb_docs_fournis: documents.length || Number(nb_docs_fournis) || 0,
      delai_declaration_jours: delai,
      sinistres_similaires: Number(sinistres_similaires) || 0,
      documents,
      statut: 'en_analyse'
    }

    const claim = await Claim.create(claimData)

    // Appel à l'API IA (Membre 1)
    let fraudScore = null
    try {
      const iaPayload = {
        age_compte_mois: claimData.age_compte_mois,
        nb_sinistres_12m: claimData.nb_sinistres_12m,
        montant_fcfa: claimData.montant_fcfa,
        type_sinistre: claimData.type_sinistre,
        nb_docs_fournis: claimData.nb_docs_fournis,
        delai_declaration_jours: claimData.delai_declaration_jours,
        sinistres_similaires: claimData.sinistres_similaires
      }
 
      const iaResponse = await axios.post(
        `${process.env.IA_API_URL}/predict`,
        iaPayload,
        { timeout: 10000 }
      )

      const { score, niveau, raisons, probabilite } = iaResponse.data
      const flagsMetier = checkReglesMetier(claimData)

      fraudScore = await FraudScore.create({
        claim: claim._id,
        score,
        niveau,
        probabilite,
        raisons,
        flags_metier: flagsMetier
      })

      // Mise à jour du statut selon le score
      let nouveauStatut = 'approuve'
      if (score >= 70) nouveauStatut = 'en_investigation'
      else if (score >= 40) nouveauStatut = 'en_analyse'

      await Claim.findByIdAndUpdate(claim._id, {
        fraud_score: fraudScore._id,
        statut: nouveauStatut
      })

    } catch (iaError) {
      console.warn('API IA indisponible, score non calculé:', iaError.message)
      await Claim.findByIdAndUpdate(claim._id, { statut: 'en_attente' })
    }

    const claimFinal = await Claim.findById(claim._id).populate('fraud_score')

    res.status(201).json({
      success: true,
      message: 'Sinistre enregistré et analysé.',
      claim: claimFinal
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/claims — Liste tous les sinistres
const getClaims = async (req, res) => {
  try {
    const { statut, niveau, page = 1, limit = 10 } = req.query
    const filter = {}

    // Agent voit seulement ses dossiers, admin voit tout
    if (req.user.role === 'agent') filter.agent = req.user._id
    if (statut) filter.statut = statut

    const claims = await Claim.find(filter)
      .populate('fraud_score')
      .populate('agent', 'nom email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Filtre par niveau fraud si demandé
    const result = niveau
      ? claims.filter(c => c.fraud_score?.niveau === niveau)
      : claims

    const total = await Claim.countDocuments(filter)

    res.json({
      success: true,
      count: result.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      claims: result
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/claims/:id — Détail d'un sinistre
const getClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('fraud_score')
      .populate('agent', 'nom email')

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Sinistre introuvable.' })
    }

    // Vérification d'accès
    if (req.user.role === 'agent' && claim.agent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé.' })
    }

    res.json({ success: true, claim })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PATCH /api/claims/:id/decision — Agent prend une décision
const updateDecision = async (req, res) => {
  try {
    const { decision, commentaire } = req.body

    const fraudScore = await FraudScore.findOne({ claim: req.params.id })
    if (!fraudScore) {
      return res.status(404).json({ success: false, message: 'Score fraude introuvable.' })
    }

    fraudScore.decision_agent = decision
    fraudScore.commentaire_agent = commentaire
    fraudScore.agent_decision = req.user._id
    await fraudScore.save()

    const nouveauStatut = decision === 'valide' ? 'approuve' : 'rejete'
    await Claim.findByIdAndUpdate(req.params.id, { statut: nouveauStatut })

    res.json({ success: true, message: 'Décision enregistrée.', fraudScore })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// DELETE /api/claims/:id — Admin seulement
const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Sinistre introuvable.' })
    }
    await FraudScore.deleteOne({ claim: claim._id })
    await claim.deleteOne()
    res.json({ success: true, message: 'Sinistre supprimé.' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { createClaim, getClaims, getClaim, updateDecision, deleteClaim }
