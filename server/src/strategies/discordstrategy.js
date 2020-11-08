const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const db = require('../db');
const tableNames = require('../../db/constants/tableNames');

passport.serializeUser(async (user, done) => {
	console.log(" ----------------- Serialize user : Saving to database ----------------- ");

	let userFromDb = await db.select('*').from(tableNames.users).where({
		discord_id: user.id
	});
	
	//if(userFromDb === null)
		console.log(userFromDb.length);


	if(userFromDb.length <= 0){
		console.log('user doesnt exists');
		let insertedUser = await db(tableNames.users).insert({
			discord_id: user.id,
			username: user.username
		});

		console.log(insertedUser);
		if(insertedUser.length !== null){
			console.log('user inserted');
		}
	}
	else{
		console.log(userFromDb);
	}

	done(null, user);
});

passport.deserializeUser((user, done) => {
	console.log("----------------- DESerialize user -----------------");
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