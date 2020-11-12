const router = require('express').Router();
const passport = require('passport');


router.get('/', passport.authenticate('discord'));

// when login is successful, retrieve user info
router.get("/isloggedin", (req, res) => {
	console.log('/isloggedin');
	if (req.user) {
		console.log('User IS logged in');
		res.json({
			success: true,
			message: "user has successfully authenticated",
			userId: req.user.id
		});
	}
	else
		console.log('User is NOT logged in');
});

router.get('/redirect', passport.authenticate('discord', {
	failureRedirect: '/',
	successRedirect: 'http://localhost:3000'
}));

module.exports = router;