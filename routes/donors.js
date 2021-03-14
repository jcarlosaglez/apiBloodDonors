const router = require('express').Router();
/* const {
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
router.post('/', responseSolicitud); */

const {
	createDonor,
	readDonor,
	updateDonor,
	deleteDonor,
	login,
	selects
} = require('../controllers/donors');

var auth = require('./auth');
const { route } = require('./receivers');

router.post("/", createDonor);
router.get("/", auth.optional, readDonor);
router.get("/pagination", auth.optional, readDonor);
router.get("/:id", auth.optional, readDonor);
router.put("/:id", auth.required, updateDonor);
router.delete("/", auth.required, deleteDonor);
router.get("/:id/:select", selects);
router.post("/login", login);


module.exports = router;