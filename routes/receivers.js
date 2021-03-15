const router = require('express').Router();
const {
	createReceiver,
	readReceiver,
	readReceiversByPages,
	updateReceiver,
	deleteReceiver,
    search,
	login
} = require('../controllers/receivers');

var auth = require("./auth");

router.post("/", createReceiver);
router.get("/", auth.optional, readReceiver);
router.get("/pagination", auth.optional, readReceiversByPages);
router.get("/search", search);
router.get("/:id", auth.optional, readReceiver);
router.put("/", auth.required, updateReceiver);
router.delete("/", auth.required, deleteReceiver);
router.post("/login", login);

module.exports = router;