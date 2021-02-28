const router = require('express').Router();
const {
    createReceiver,
    readReceivers,
    readReceiver,
    updateReceiver,
    deleteReceiver,
    requestDonador
} = require('../controllers/receivers')

router.get('/', readReceivers)
router.get('/:id', readReceiver)
router.post('/', createReceiver)
router.put('/:id', updateReceiver)
router.delete('/:id', deleteReceiver)
router.post('/', requestDonador)

module.exports = router;