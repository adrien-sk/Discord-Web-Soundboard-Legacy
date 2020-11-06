const router = require('express').Router();
const passport = require('passport');


// when login is successful, retrieve user info
router.get("/isloggedin", (req, res) => {
	console.log('/isloggedin');
	if (req.user) {
		console.log('User IS logged in');
		res.json({
			success: true,
			message: "user has successfully authenticated",
			user: req.user
		});
	}
	else
		console.log('User is NOT logged in');
});

router.get('/', passport.authenticate('discord'));

router.get('/redirect', passport.authenticate('discord', {
	failureRedirect: '/',
	successRedirect: '/'
}));

module.exports = router;