require('dotenv').config();
const SERVER_PORT = process.env.SERVER_PORT;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const express = require('express');
const app = express();
const server = app.listen(SERVER_PORT, () => console.log(`Server started on port ${SERVER_PORT}`));
const io = require('socket.io').listen(server);

const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');



//Status of sound playing
let playing = false;

//Login the bot to the discord server
client.login(DISCORD_TOKEN);

//Receive "connection" event from client : Someone opened the webapp
io.on('connection', (socket) => {
	//Send a status update to the client (is a sound playing ?)
	socket.emit('statusUpdate', {playing: playing});

	//Receive Play Sound event
	socket.on('playSoundEvent', (path) => {

		//Temp Hardcoding my Voice Channel
		let voiceChannel = client.channels.cache.get("534000212184793103");

		//Bot Join the channel + Promise : 
		voiceChannel.join().then(connection => {

			//Play the sound with provided path
			const dispatcher = connection.play(path); 

			//On sound start event : update the state with Playing status
			dispatcher.on('start', () => {
				playing = true;
				io.emit('statusUpdate', {playing: playing});
				console.log('-> Sound launched');
			});
			
			//On sound finish event : update the state with Playing status
			dispatcher.on('finish', () => {
				playing = false;
				console.log('---> Sound Finished');
				io.emit('statusUpdate', {playing: playing});
			});
		})
	});

	//Receive "disconnect" event from client : Someone closed the webapp
	socket.on('disconnect', () => {
		console.log(' - User disconnected');
	});
});


//CORS Declaration
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});
