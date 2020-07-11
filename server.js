//Define const from .ENV
require('dotenv').config();
const SERVER_PORT = process.env.PORT || 5000;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const SOUNDS_FOLDER = process.env.SOUNDS_FOLDER;
const TEMP_FOLDER = process.env.SOUNDS_FOLDER+'temp';
const VOICE_CHANNEL = process.env.VOICE_CHANNEL;

//App Consts
const express = require('express');
const app = express();
const server = app.listen(SERVER_PORT, () => console.log(`Server started on port ${SERVER_PORT}`));
const io = require('socket.io').listen(server);
const cors = require('cors');

const spawn = require('child_process').spawn;
const cmd = require('ffmpeg-static');
const formidable = require('formidable');

const fs = require('fs');
const {Client, Collection, DataResolver} = require('discord.js');
const client = new Client();


//List audio files at opening of the server
client.sounds = new Collection();
const soundDataFiles = fs.readdirSync(SOUNDS_FOLDER).filter(file => file.endsWith('.js'));

for(const file of soundDataFiles){
	const sound = require(SOUNDS_FOLDER+file);
	client.sounds.set(sound.id, sound);
}

app.use(express.urlencoded({extended: false}));
app.use(cors());


//last sound played at
let lastSoundPlayedAt = Date.now();

//Status of sound playing
let playing = false;
//Voice Channel var
let voiceChannel = null;

//Login the bot to the discord server
client.login(DISCORD_TOKEN);

/*client.on('debug', () =>{
	if(client.voice.connections.size > 0){
		console.log('Voice connection detected');
		console.log('Time of Var = '+lastSoundPlayedAt);
		console.log('Time of Now = '+Date.now());
		if(Date.now() - lastSoundPlayedAt >= 10000){
			console.log('Diff > 10s');
			client.voice.connections.first().disconnect();
		}
		//console.log(client.voice.connections.first());
	}
	else{
		console.log('No voice connection');
	}
});*/



client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	//Hardcoding voicechannel number (later we may get authenticated user current's channel)
	voiceChannel = client.channels.cache.get(VOICE_CHANNEL);
});
  
io.on('connection', (socket) => {
	console.log(' - User connected');

	//Send a status update to the client (is a sound playing ?)
	socket.emit('statusUpdate', {playing: playing});

	//Send list of sounds to client
	socket.emit('updateSounds', {sounds: client.sounds});

	//Receive Play Sound event
	socket.on('playSoundEvent', (path, volume) => {
		//Is a voice connection existing ? If not, connect it
		if(client.voice.connections.size <= 0){
			voiceChannel.join();
		}

		// Play an Ogg Opus stream
		const dispatcher = client.voice.connections.first().play(fs.createReadStream(SOUNDS_FOLDER+path), { type: 'ogg/opus', volume: volume });

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
			lastSoundPlayedAt = Date.now();
			console.log('Set Var to : '+lastSoundPlayedAt);
		});

		dispatcher.on('error', console.error);

	});
		
	//Receive "stop all sound" event from client
	socket.on('stopAllSound', () => {
		if(client.voice.connections.size > 0 && client.voice.connections.first().dispatcher !== null){
			client.voice.connections.first().dispatcher.pause();
			client.voice.connections.first().dispatcher.destroy();
			playing = false;
			io.emit('statusUpdate', {playing: playing});
		}
	});
	
	//Receive "stop all sound" event from client
	socket.on('soundUploaded', () => {
		io.emit('updateSounds', {sounds: client.sounds});
	});

	//Receive "disconnect" event from client : Someone closed the webapp
	socket.on('disconnect', () => {
		console.log(' - User disconnected');
	});
});



app.post('/upload', async (req, res) => {
	const form = formidable();
	
	// ./sounds/test
	form.uploadDir = TEMP_FOLDER;

	// 50 mo
	form.maxFileSize = 50 * 1024 * 1024;
	form.multiples = true;

	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.log(err);
			next(err);
			return;
		}

		//Transform to ogg
		//let oldFileName = files.sounds[0].name; // = "machin.mp3"
		let tempFileName = files.sounds.path; // = "sounds/test/upload_fdgksdjfglkdjsfhglsdfg"
		let newFileName = slugify(fields.title);
		let soundtitle = fields.title;

		let args = [
			'-y', 
			'-i', tempFileName,
			'-c:a', 'libopus', 
			'-b:a', '96k', 
			'-f', 'ogg', SOUNDS_FOLDER+newFileName+'.ogg'
		];
		
		//Copy as .ogg and remove temp file
		let proc = spawn(cmd, args);
		proc.on('exit', async (err) => {

			if(err){
				console.log('Ogg Transformation Error !');
			}
			else{
				await fs.unlinkSync(tempFileName);

				//Create JS file
				let fileContent = `
				module.exports = {
					id: '${newFileName}',
					description: '${soundtitle.replace(/\'/g,"\\'")}',
					extension: '.ogg'
				}`;
				fs.appendFile(SOUNDS_FOLDER+newFileName+'.js', fileContent, err => {
					//Add JS file of the sound to sounds object
					const newSound = require(SOUNDS_FOLDER+newFileName+'.js');
					client.sounds.set(newSound.id, newSound);
					res.status(200).send();
				});
			}
		})
	});
});


//Function to normalize name for the file
function slugify (str) {
    var map = {
        '_' : ' |-',
        'a' : 'ä|á|à|ã|â|Ä|À|Á|Ã|Â',
        'e' : 'ë|é|è|ê|Ë|É|È|Ê',
        'i' : 'ï|í|ì|î|Ï|Í|Ì|Î',
        'o' : 'ö|ó|ò|ô|õ|Ö|Ó|Ò|Ô|Õ',
        'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        'c' : 'ç|Ç',
        'n' : 'ñ|Ñ'
    };
    
    str = str.toLowerCase();
    
    for (var pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern);
	};
	
	var regExpr = /[^a-z0-9_]/g;
	str = str.replace(regExpr, '');
    return str;
};