const express = require('express');

const authRoutes = require('./auth/auth.routes');

const router = express.Router();


router.get('/', (req, res) => {
	res.json({
		message: 'Soundboard API'
	});
});


router.use('/auth', authRoutes);


module.exports = router;