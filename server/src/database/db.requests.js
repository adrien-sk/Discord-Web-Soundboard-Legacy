const dbConnection = require('./db.connection');
const tableNames = require('../../db/constants/tableNames');
const { where } = require('./db.connection');


const requests = {
	getAllUsers:  async () => {
		const req = await dbConnection(tableNames.users).select('*');

		return req;
	},
	getUserById:  async (id) => {
		const req = await dbConnection(tableNames.users).select('*').where({
			discord_id: id
		}).first();

		return req;
	},
	addUser:  async (id, username) => {
		const req = await dbConnection(tableNames.users).insert({
			discord_id: id,
			username: username
		});

		return req;
	},
	getAllSounds: async () => {
		const req = await dbConnection(tableNames.sounds).select('*');

		return req;
	},
	getUserSounds: async (id) => {
		const req = await dbConnection(tableNames.users_sounds).select('*').where({
			user_id: id
		});

		return req;
	},
	getUserCategories: async (id) => {
		const req = await dbConnection(tableNames.categories).select('*').where({
			user_id: id
		});

		return req;
	},
}

module.exports = requests;