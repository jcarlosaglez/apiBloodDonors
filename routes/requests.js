const router = require('express').Router();
const {
	createRequest,
	readRequest,
	readRequestsByPages,
	updateRequest,
	deleteRequest,
	search
} = require('../controllers/requests');

var auth = require("./auth");

router.post("/", auth.required, createRequest);
router.get("/", auth.optional, readRequest);
router.get("/pagination", auth.optional, readRequestsByPages);
router.get("/search", search);
router.get("/:id", auth.optional, readRequest);
router.put("/:id", auth.required, updateRequest);
router.delete("/:id", auth.required, deleteRequest);

module.exports = router;