//Define const from .ENV
require('dotenv').config();
const SERVER_PORT = process.env.PORT || 5000;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const SOUNDS_FOLDER = process.env.SOUNDS_FOLDER;
const VOICE_CHANNEL = process.env.VOICE_CHANNEL;

//App Consts
const express = require('express');
const app = express();
const server = app.listen(SERVER_PORT, () => console.log(`Server started on port ${SERVER_PORT}`));
const io = require('socket.io').listen(server);
const cors = require('cors');

const fs = require('fs');
const {Client, Collection} = require('discord.js');
const client = new Client();


//List audio files
client.sounds = new Collection();
const soundDataFiles = fs.readdirSync('./sounds').filter(file => file.endsWith('.js'));

for(const file of soundDataFiles){
	const sound = require(SOUNDS_FOLDER+file);
	client.sounds.set(sound.id, sound);
}


//Status of sound playing
let playing = false;
//Voice Channel var
let voiceChannel = null;

//Login the bot to the discord server
client.login(DISCORD_TOKEN);



client.on('ready', () => {
	//Hardcoding voicechannel number (later we may get authenticated user current's channel)
	voiceChannel = client.channels.cache.get(VOICE_CHANNEL);
});
  
io.on('connection', (socket) => {

	//Send a status update to the client (is a sound playing ?)
	socket.emit('statusUpdate', {playing: playing});

	//Send list of sounds to client
	socket.emit('updateSounds', {sounds: client.sounds});

	//Receive Play Sound event
	socket.on('playSoundEvent', (path) => {

		//Is a voice connection existing ? If not, connect it
		if(client.voice.connections.size <= 0){
			voiceChannel.join();
		}

		//Play the sound with provided path
		const dispatcher = client.voice.connections.first().play(SOUNDS_FOLDER+path, { highWaterMark: 400 }); 

		// Play an Ogg Opus stream
		//TO DO : transform mp3 in ogg to read stream
		//const dispatcher = connection.play(fs.createReadStream('audio.ogg'), { type: 'ogg/opus' });

		//On sound start event : update the state with Playing status
		dispatcher.on('start', () => {
			playing = true;
			io.emit('statusUpdate', {playing: playing});
		});
		
		//On sound finish event : update the state with Playing status
		dispatcher.on('finish', () => {
			playing = false;
			io.emit('statusUpdate', {playing: playing});
			dispatcher.destroy(); 
		});
		
		//Receive "stop all sound" event from client
		socket.on('stopAllSound', () => {
			dispatcher.destroy();
			playing = false;
			io.emit('statusUpdate', {playing: playing});
		});

		dispatcher.on('error', console.error);

	});

	//Receive "disconnect" event from client : Someone closed the webapp
	socket.on('disconnect', () => {
		
	});
});

app.use(cors());