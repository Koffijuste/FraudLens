const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Génère un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nom, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' })
    }

    const user = await User.create({ nom, email, password, role })
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      token,
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' })
    }

    if (!user.actif) {
      return res.status(403).json({ success: false, message: 'Compte désactivé.' })
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Connexion réussie.',
      token,
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, nom: req.user.nom, email: req.user.email, role: req.user.role }
  })
}

module.exports = { register, login, getMe }
