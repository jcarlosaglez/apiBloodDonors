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
	login
} = require('../controllers/receivers');

var auth = require("./auth");

router.post("/", createReceiver);
router.get("/", auth.optional, readReceiver);
router.get("/:id", auth.optional, readReceiver);
router.put("/:id", auth.optional, updateReceiver);
router.delete("/:id", auth.optional, deleteReceiver);
router.post("/", login);

module.exports = router;