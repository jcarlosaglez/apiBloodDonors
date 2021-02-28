const router = require('express').Router();
const {
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
router.delete('/:id', deleteRequest);

module.exports = router;