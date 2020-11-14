const Knex = require('knex');
const tableNames = require('../constants/tableNames');

exports.up = async (knex) => {
	await knex.schema.createTable(tableNames.users, (table) => {
		table.string('discord_id').primary().notNullable().unique();
		table.string('username').notNullable();
	});

	await knex.schema.createTable(tableNames.sounds, (table) => {
		table.increments().notNullable();
		table.text('display_name').notNullable().unique();
		table.string('file_name').notNullable().unique();	
		table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
	});

	await knex.schema.createTable(tableNames.categories, (table) => {
		table.increments().notNullable();
		table.string('name').notNullable();
		table.string('user_id').references('discord_id').inTable(tableNames.users);
	});

	await knex.schema.createTable(tableNames.users_sounds, (table) => {
		table.increments().notNullable();
		table.string('user_id').notNullable().references('discord_id').inTable(tableNames.users).onDelete('CASCADE');
		table.integer('category_id').notNullable().references('id').inTable(tableNames.categories).onDelete('CASCADE');
		table.integer('sound_id').notNullable().references('id').inTable(tableNames.sounds).onDelete('CASCADE');
		table.integer('volume').notNullable();// TODO : defaultTo
		table.integer('order').notNullable();// TODO : max + 1 (think about sorting and updates)
	});
};

exports.down = async (knex) => {	
	await knex.schema.dropTable(tableNames.users_sounds);
	await knex.schema.dropTable(tableNames.categories);
	await knex.schema.dropTable(tableNames.users);
	await knex.schema.dropTable(tableNames.sounds);
};
