const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new DiscordStrategy({
	clientID: process.env.OAUTH_CLIENT_ID,
	clientSecret: process.env.OAUTH_CLIENT_SECRET,
	callbackURL: process.env.OAUTH_CLIENT_REDIRECT,
	scope: ['identify', 'email', 'connections', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
	console.log(profile.id);
	done(null, profile);
}));