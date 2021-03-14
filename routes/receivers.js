const router = require('express').Router();
/* const {
    createReceiver,
    readReceivers,
    readReceiver,
    updateReceiver,
    deleteReceiver,
    requestDonador
} = require('../controllers/receivers');

router.get('/', readReceivers);
router.get('/:id', readReceiver);
router.post('/', createReceiver);
router.put('/:id', updateReceiver);
router.delete('/:id', deleteReceiver);
router.post('/', requestDonador); */

const {
	createReceiver,
	readReceiver,
	updateReceiver,
	deleteReceiver,
    selects,
	login
} = require('../controllers/receivers');

var auth = require("./auth");

router.post("/", createReceiver);
router.get("/", auth.optional, readReceiver);
router.get("/pagination", auth.optional, readReceiver);
router.get("/:id", auth.optional, readReceiver);
router.put("/:id", auth.required, updateReceiver);
router.delete("/", auth.required, deleteReceiver);
router.get("/:id/:select", selects);
router.post("/login", login);

module.exports = router;