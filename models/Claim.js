const mongoose = require('mongoose')

const claimSchema = new mongoose.Schema({
  // Référence à l'agent qui a soumis
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Informations sur l'assuré
  assure: {
    nom: { type: String, required: true },
    telephone: { type: String },
    numero_police: { type: String, required: true }
  },

  // Détails du sinistre
  type_sinistre: {
    type: String,
    enum: ['accident_auto', 'incendie', 'vol', 'sante', 'accident_moto'],
    required: true
  },
  montant_fcfa: {
    type: Number,
    required: true,
    min: 0
  },
  date_sinistre: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },

  // Données pour l'IA (calculées automatiquement)
  age_compte_mois: {
    type: Number,
    required: true
  },
  nb_sinistres_12m: {
    type: Number,
    default: 0
  },
  nb_docs_fournis: {
    type: Number,
    default: 0
  },
  delai_declaration_jours: {
    type: Number,
    default: 0
  },
  sinistres_similaires: {
    type: Number,
    default: 0
  },

  // Documents uploadés
  documents: [{
    nom: String,
    chemin: String,
    type: String,
    date_upload: { type: Date, default: Date.now }
  }],

  // Résultat de l'analyse IA
  fraud_score: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FraudScore'
  },

  // Statut du dossier
  statut: {
    type: String,
    enum: ['en_attente', 'en_analyse', 'approuve', 'rejete', 'en_investigation'],
    default: 'en_attente'
  }
}, { timestamps: true })

module.exports = mongoose.model('Claim', claimSchema)
