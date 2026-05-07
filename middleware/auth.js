const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Vérification du token JWT
const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Accès non autorisé. Token manquant.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Utilisateur introuvable.' })
    }
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré.' })
  }
}

// Restriction par rôle
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Rôle '${req.user.role}' non autorisé pour cette action.`
      })
    }
    next()
  }
}

module.exports = { protect, authorize }
