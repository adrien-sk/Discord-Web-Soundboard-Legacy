const express = require('express');

const router = express.Router();

const dbRequests = require ('../database/db.requests');

router.get('/', (req, res) => {
	res.json({
		message: 'Soundboard API'
	});
});

router.get('/getusercategories', async (req, res) => {
	const dbResults = await dbRequests.getUserCategories(req.user.id);
	res.json(dbResults);
});

router.get('/getusersounds', async (req, res) => {
	const dbResults = await dbRequests.getUserSounds(req.user.id);
	res.json(dbResults);
});

module.exports = router;