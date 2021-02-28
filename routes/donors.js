const router = require('express').Router();
const {
	createDonador,
	readDonador,
	readDonadores,
	updateDonador,
	deleteDonador,
	responseSolicitud
} = require('../controllers/donors');

router.get('/', readDonadores);
router.get('/:id', readDonador);
router.post('/', createDonador);
router.put('/:id', updateDonador);
router.delete('/:id', deleteDonador);
router.post('/', responseSolicitud);

module.exports = router;