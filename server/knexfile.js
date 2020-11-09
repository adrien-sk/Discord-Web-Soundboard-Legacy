require ('dotenv').config({path: '../.env'});

module.exports = {

	development: {
		client: 'postgresql',
		connection: {
			database: process.env.POSTGRES_DB,
			user:     process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			charset   : 'utf8'
		},
		migrations: {
			directory: './db/migrations'
		}
	}
};
