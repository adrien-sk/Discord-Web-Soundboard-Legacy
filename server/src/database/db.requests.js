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
	getUserSoundsObject: async (id) => {
		const categoriesResult = await dbConnection(tableNames.categories).select('id', 'name').where({
			user_id: id
		});

		for(let i=0; i < categoriesResult.length; i++){
			let sounds = [];
			
			const soundsInCategoryResult = await dbConnection(tableNames.users_sounds).select('*').where({
				user_id: id,
				category_id: categoriesResult[i].id
			});


			for(let j=0; j < soundsInCategoryResult.length; j++){
				const soundResult = await dbConnection(tableNames.sounds).select('*').where({
					id: soundsInCategoryResult[j].sound_id
				}).first();

				soundResult.user_sound_id = soundsInCategoryResult[j].id;
				/*soundResult.user_id = id;
				soundResult.user_category_id = categoriesResult[i].id;*/

				sounds.push(soundResult);
			}

			categoriesResult[i].sounds = sounds;
		}

		return categoriesResult;
	},
	updateUserSound:  async (userSoundId, categoryId) => {
		const req = await dbConnection(tableNames.users_sounds).where({
			id: userSoundId
		}).update({
			category_id: categoryId
		});

		return req;
	},
}

module.exports = requests;