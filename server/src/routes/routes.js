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

router.get('/getusersoundsobject', async (req, res) => {
	const dbResults = await dbRequests.getUserSoundsObject(req.user.id);
	res.json(dbResults);
});

router.put('/updateusersound', async (req, res) => {
	const dbResults = await dbRequests.updateUserSound(req.body.userSoundId, req.body.newCategory);
	res.json(dbResults);
});

module.exports = router;