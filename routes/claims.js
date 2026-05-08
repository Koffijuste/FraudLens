const express = require('express')
const router = express.Router()
const { createClaim, getClaims, getClaim, updateDecision, deleteClaim } = require('../controllers/claimController')
const { protect, authorize } = require('../middleware/auth')
const upload = require('../middleware/upload')

router.use(protect)

router.get('/', getClaims)
router.post('/', upload.array('documents', 5), createClaim)
router.get('/:id', getClaim)
router.patch('/:id/decision', updateDecision)
router.delete('/:id', authorize('admin'), deleteClaim)

module.exports = router
