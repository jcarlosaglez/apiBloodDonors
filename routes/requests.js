const router = require('express').Router();
/* const {
    createRequest,
	readRequests,
	readRequest,
	updateRequest,
	deleteRequest
} = require('../controllers/requests');

router.get('/', readRequests);
router.get('/:id', readRequest);
router.post('/', createRequest);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest); */

const {
	createRequest,
	readRequest,
	updateRequest,
	deleteRequest
} = require('../controllers/requests');

var auth = require("./auth");

router.post("/", auth.required, createRequest);
router.get("/", auth.optional, readRequest);
router.get("/:id", auth.optional, readRequest);
router.put("/:id", auth.required, updateRequest);
router.delete("/:id", auth.required, deleteRequest);

module.exports = router;