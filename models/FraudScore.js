const mongoose = require('mongoose')

const fraudScoreSchema = new mongoose.Schema({
  claim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim',
    required: true
  },

  // Résultats de l'API IA (Membre 1)
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  niveau: {
    type: String,
    enum: ['normal', 'suspect', 'fraude_probable'],
    required: true
  },
  probabilite: {
    type: Number,
    required: true
  },
  raisons: [{
    type: String
  }],

  // Règles métier déclenchées avant l'IA
  flags_metier: [{
    type: String
  }],

  // Décision finale de l'agent
  decision_agent: {
    type: String,
    enum: ['en_attente', 'valide', 'rejete'],
    default: 'en_attente'
  },
  commentaire_agent: {
    type: String
  },
  agent_decision: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

module.exports = mongoose.model('FraudScore', fraudScoreSchema)
