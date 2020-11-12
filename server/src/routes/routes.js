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

// TODO : Into post
router.put('/addusersound', async (req, res) => {
	const dbResults = await dbRequests.addUserSound(req.user.id, req.body.userSoundId, req.body.newCategory);
	console.log('---------------------------------- Add sound is back');
	res.json(dbResults);
});

router.delete('/deleteusersound', async (req, res) => {
	const dbResults = await dbRequests.deleteUserSound(req.body.userSoundId);
	console.log('---------------------------------- Delete sound is back');
	res.json(dbResults);
});

router.post('/addusercategory', async (req, res) => {
	const dbResults = await dbRequests.addUserCategory(req.user.id);
	res.json(dbResults);
});

router.put('/updatecategoryname', async (req, res) => {
	const dbResults = await dbRequests.updateCategoryName(req.body.categoryId, req.body.newCategoryName);
	res.json(dbResults);
});

router.delete('/deleteusercategory', async (req, res) => {
	const dbResults = await dbRequests.deleteUserCategory(req.body.categoryId);
	res.json(dbResults);
});

module.exports = router;