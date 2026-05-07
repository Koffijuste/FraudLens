const express = require('express')
const router = express.Router()
const { createClaim, getClaims, getClaim, updateDecision, deleteClaim } = require('../controllers/claimController')
const { protect, authorize } = require('../middleware/auth')
const upload = require('../middleware/upload')

router.get('/', protect, getClaims)
router.post('/', protect, upload.array('documents', 5), createClaim)
router.get('/:id', protect, getClaim)
router.patch('/:id/decision', protect, updateDecision)
router.delete('/:id', protect, authorize('admin'), deleteClaim)

module.exports = router
