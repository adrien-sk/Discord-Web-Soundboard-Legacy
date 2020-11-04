const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('discord'));
router.get('/redirect', passport.authenticate('discord', {
	failureRedirect: '/',
	successRedirect: '/dashboard'
}), (req, res) => {
	res.status(200).redirect('/dashboard');
});

module.exports = router;