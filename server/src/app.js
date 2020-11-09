//App Consts
const express = require('express');
const helmet = require('helmet');
const sessionMiddleware = require('./sessionMiddleware');
const passport = require('passport');
const cors = require('cors');

const routes = require('./routes/routes');
const authRoutes = require('./routes/auth/auth.routes');
const discordStrategy = require('./strategies/discordstrategy');

const app = express();


app.use(cors({
	origin: "http://localhost:3000", // allow to server to accept request from different origin
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true // allow session cookie from browser to pass through
}));

app.set('trust proxy', 1);

app.use(sessionMiddleware);

app.use(passport.initialize());

app.use(passport.session());

app.use(express.urlencoded({extended: false}));

app.use(helmet());



/* routes */

app.use('/auth', authRoutes);
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