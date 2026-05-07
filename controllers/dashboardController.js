const Claim = require('../models/Claim')
const FraudScore = require('../models/FraudScore')

// GET /api/dashboard — Stats globales pour le frontend
const getDashboard = async (req, res) => {
  try {
    const filter = req.user.role === 'agent' ? { agent: req.user._id } : {}

    // Totaux par statut
    const [total, enAttente, enInvestigation, approuves, rejetes] = await Promise.all([
      Claim.countDocuments(filter),
      Claim.countDocuments({ ...filter, statut: 'en_attente' }),
      Claim.countDocuments({ ...filter, statut: 'en_investigation' }),
      Claim.countDocuments({ ...filter, statut: 'approuve' }),
      Claim.countDocuments({ ...filter, statut: 'rejete' })
    ])

    // Répartition par niveau de fraude
    const scoresPipeline = [
      { $lookup: { from: 'claims', localField: 'claim', foreignField: '_id', as: 'claim_data' } },
      { $unwind: '$claim_data' },
      ...(req.user.role === 'agent'
        ? [{ $match: { 'claim_data.agent': req.user._id } }]
        : []),
      { $group: { _id: '$niveau', count: { $sum: 1 }, score_moyen: { $avg: '$score' } } }
    ]
    const niveaux = await FraudScore.aggregate(scoresPipeline)

    // Top 5 sinistres les plus suspects (score le plus élevé)
    const topSuspects = await FraudScore.find()
      .sort({ score: -1 })
      .limit(5)
      .populate({
        path: 'claim',
        populate: { path: 'agent', select: 'nom' }
      })

    // Évolution sur 7 jours
    const sept_jours = new Date()
    sept_jours.setDate(sept_jours.getDate() - 7)

    const evolutionPipeline = [
      { $match: { ...filter, createdAt: { $gte: sept_jours } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]
    const evolution = await Claim.aggregate(evolutionPipeline)

    // Montant total par type de sinistre
    const montantParType = await Claim.aggregate([
      { $match: filter },
      { $group: { _id: '$type_sinistre', total_montant: { $sum: '$montant_fcfa' }, count: { $sum: 1 } } },
      { $sort: { total_montant: -1 } }
    ])

    res.json({
      success: true,
      stats: {
        total,
        en_attente: enAttente,
        en_investigation: enInvestigation,
        approuves,
        rejetes,
        taux_fraude: total > 0 ? ((enInvestigation / total) * 100).toFixed(1) : 0
      },
      niveaux_fraude: niveaux,
      top_suspects: topSuspects,
      evolution_7j: evolution,
      montant_par_type: montantParType
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getDashboard }
