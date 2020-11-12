const dbConnection = require('./db.connection');
const tableNames = require('../../db/constants/tableNames');
const { where, select } = require('./db.connection');


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
	getAllSoundsFiltered: async () => {
		/*const req1 = await dbConnection.select('*').from(tableNames.sounds)
		.leftJoin(tableNames.users_sounds, `${tableNames.sounds}.id`, `${tableNames.users_sounds}.sound_id`)
		.andWhere(`${tableNames.users_sounds}.user_id`, '314837688379375616')
		.andWhereNull(`${tableNames.users_sounds}.id`);*/
		
		const req = await dbConnection.raw('SELECT "sounds".* FROM sounds LEFT JOIN "users_sounds" ON "sounds"."id" = "users_sounds"."sound_id" AND "users_sounds"."user_id" = \'314837688379375616\' WHERE "users_sounds".id IS NULL;')

		return req.rows;
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
	addUserSound:  async (userId, userSoundId, categoryId) => {
		const soundExists = await dbConnection(tableNames.users_sounds).select('*').where({
			user_id: userId,
			sound_id: userSoundId
		});

		let req = null;

		if(soundExists.length === 0){
			req = await dbConnection(tableNames.users_sounds).insert({
				user_id: userId,
				category_id: categoryId,
				sound_id: userSoundId,
				volume: 10,
				order: 1
			});
		}

		return req;
	},
	deleteUserSound:  async (userSoundId) => {
		const req = await dbConnection(tableNames.users_sounds).where({
			id: userSoundId
		}).del();

		return req;
	},
	addUserCategory:  async (userId) => {
		const req = await dbConnection(tableNames.categories).insert({
			name: 'New Category',
			user_id: userId
		});

		return req;
	},
	updateCategoryName:  async (categoryId, newCategoryName) => {
		const req = await dbConnection(tableNames.categories).where({
			id: categoryId
		}).update({
			name: newCategoryName
		});

		return req;
	},
	deleteUserCategory:  async (categoryId) => {
		const req = await dbConnection(tableNames.categories).where({
			id: categoryId
		}).del();

		return req;
	},
}

module.exports = requests;