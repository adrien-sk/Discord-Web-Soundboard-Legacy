const session = require('express-session');

const redisStore = require('./redisClient');

const sessionMiddleware = session({
	secret: 'MySecretSalt',
	store: redisStore,
	cookie: {
		maxAge: 60000 * 60 * 24
	},
	saveUninitialized: false, 
	resave: false,
	name: 'discord.oauth2'
});

module.exports = sessionMiddleware;