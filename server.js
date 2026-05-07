require('dotenv').config({ path: './config/.env' })
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const connectDB = require('./config/db')

const app = express()

// Connexion MongoDB
connectDB()

// Middlewares globaux
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Accès aux fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/claims', require('./routes/claims'))
app.use('/api/dashboard', require('./routes/dashboard'))

// Route de test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FraudLens API — opérationnelle',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      claims: '/api/claims',
      dashboard: '/api/dashboard'
    }
  })
})

// Gestion des routes inconnues
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} introuvable.` })
})

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: err.message || 'Erreur serveur.' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
