
/*
	Not used for the moment
	Maybe i'll implement Objection later
*/

const { Model } = require ('objection');

const tableNames = require('../constants/tableNames');

// Users model
class Users extends Model {
	static get tableName() {
		return tableNames.users;
	}
  /*
	static get relationMappings() {
		return {
			children: {
				relation: Model.HasManyRelation,
				modelClass: Person,
				join: {
					from: 'persons.id',
					to: 'persons.parentId'
				}
			}
		};
	}*/
}

module.exports = Users;