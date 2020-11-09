const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const databaseRequests = require('../database/db.requests');
const tableNames = require('../../db/constants/tableNames');

passport.serializeUser(async (user, done) => {
	let userFromDb = await databaseRequests.getUserById(user.id);
	
	if(userFromDb === undefined){
		let insertedUser = await databaseRequests.addUser(user.id, user.username);
	}

	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new DiscordStrategy({
	clientID: process.env.OAUTH_CLIENT_ID,
	clientSecret: process.env.OAUTH_CLIENT_SECRET,
	callbackURL: process.env.OAUTH_CLIENT_REDIRECT,
	scope: ['identify']
}, (accessToken, refreshToken, profile, done) => {
	console.log(profile.id);
	done(null, profile);
}));