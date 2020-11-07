//App Consts
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const routes = require('./routes/routes');
const discordStrategy = require('./strategies/discordstrategy');

const app = express();


app.use(cors({
	origin: "http://localhost:3000", // allow to server to accept request from different origin
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true // allow session cookie from browser to pass through
}));

app.use(session({
	secret: 'MySecretSalt',
	cookie: {
		maxAge: 60000 * 60 * 24
	},
	saveUninitialized: false, 
	resave: false,
	name: 'discord.oauth2'
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(express.urlencoded({extended: false}));

app.use(helmet());



/* routes */

app.use('/api', routes);

app.get('/', (req, res) => {
	res.json({
		message: 'Soundboard API'
	});
});

app.use((req, res) => {
	const error = new Error(`Not found - ${req.originalUrl}`);
	res.sendStatus(404);
});

/* ------- */



module.exports = app;