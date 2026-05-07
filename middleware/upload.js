const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Dossier d'upload
const uploadDir = 'uploads/'
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/
  const extname = allowed.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowed.test(file.mimetype)
  if (extname && mimetype) return cb(null, true)
  cb(new Error('Seuls les fichiers JPG, PNG et PDF sont acceptés.'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
})

module.exports = upload
