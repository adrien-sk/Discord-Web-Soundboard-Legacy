require('dotenv').config({path: '../../.env'});

const SERVER_PORT = process.env.PORT || 5000;
const TEMP_FOLDER = process.env.SOUNDS_FOLDER+'temp';

const redisStore = require('./redisClient');

const passportSocketIo = require("passport.socketio");

const dbRequests = require ('./database/db.requests');
const db = require ('../src/database/db.connection');


// Sounds files --------------
const spawn = require('child_process').spawn;
const cmd = require('ffmpeg-static');
const formidable = require('formidable');
const fs = require('fs');

const {Client, Collection, DataResolver} = require('discord.js');
const client = new Client();


/* 
	App
	Server
	Socket.IO
*/


const app = require('./app');
const tableNames = require('../db/constants/tableNames');
const { knexSnakeCaseMappers } = require('objection');

const server = app.listen(SERVER_PORT, () => console.log(`Server started on port ${SERVER_PORT}`));

const io = require('socket.io').listen(server);

io.use(passportSocketIo.authorize({
	key:          'discord.oauth2',  // the name of the cookie where express/connect stores its session_id
	secret:       'MySecretSalt',    // the session_secret to parse the cookie
	store: redisStore,
}));

//Login the bot to the discord server
client.login(process.env.DISCORD_TOKEN);





const getAllSounds =  async () => {
	client.sounds.clear();
	const filteredSounds = await dbRequests.getAllSoundsFiltered();

	for(let i=0; i<filteredSounds.length; i++){
		client.sounds.set(filteredSounds[i].id, filteredSounds[i]);
	}
}


// List audio files at opening of the server
client.sounds = new Collection();

getAllSounds();
/*
	let reqInsert2 = await db(tableNames.categories).insert([
		{
			user_id: '314837688379375616',
			name: 'Musique'
		},
		{
			user_id: '314837688379375616',
			name: 'Films'
		},
		{
			user_id: '314837688379375616',
			name: "Létâist d'accents"
		},
	]);*/

	/*
let reqInsert = await db(tableNames.users_sounds).insert([
	{
		user_id: '314837688379375616',
		category_id: 1,
		sound_id: 1,
		volume: 10,
		order: 1
	},
	{
		user_id: '314837688379375616',
		category_id: 1,
		sound_id: 2,
		volume: 10,
		order: 1
	},
	{
		user_id: '314837688379375616',
		category_id: 1,
		sound_id: 3,
		volume: 10,
		order: 1
	},
	{
		user_id: '314837688379375616',
		category_id: 2,
		sound_id: 9,
		volume: 10,
		order: 1
	},
	{
		user_id: '314837688379375616',
		category_id: 2,
		sound_id: 19,
		volume: 10,
		order: 1
	},
	{
		user_id: '314837688379375616',
		category_id: 3,
		sound_id: 21,
		volume: 10,
		order: 1
	}
]);*/
/*
	var promises = [];
	for(const file of soundDataFiles){
		const sound = require(process.env.SOUNDS_FOLDER+file);
		client.sounds.set(sound.id, sound);

		let insertedSound =
		db(tableNames.sounds).insert({
			display_name: sound.description,
			file_name: sound.id+''+sound.extension
		});
	
		promises.push(insertedSound);
	}

	Promise.all(promises).then(() => console.log('Promises done')).catch(() => console.log('promises fail'));

})();*/

	











// -------------------------


// File upload
app.post('/api/upload', async (req, res) => {
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
			'-f', 'ogg', process.env.SOUNDS_FOLDER+newFileName+'.ogg'
		];
		
		//Copy as .ogg and remove temp file
		let proc = spawn(cmd, args);
		proc.on('exit', async (err) => {

			if(err){
				console.log('Ogg Transformation Error !');
			}
			else{
				await fs.unlinkSync(tempFileName);

				let sound = { 
					id: newFileName,
					description: soundtitle, 
					extension: '.ogg',
					volume: 10 
				};
				
				let data = JSON.stringify(sound);
				fs.writeFileSync(process.env.SOUNDS_FOLDER+newFileName+'.json', data);
		
				client.sounds.set(sound.id, sound);

				res.status(200).send();
			}
		})
	});
});

//-------------------------------------------------------------------


//last sound played at
let lastSoundPlayedAt = Date.now();

//Status of sound playing
let playing = false;
//Voice Channel var
let voiceChannel = null;


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
	//voiceChannel = client.channels.cache.get(process.env.VOICE_CHANNEL);

	/*for (let item of voiceChannel.guild.members.cache.values()) {
		console.log(item.user.username);
	}*/
});




io.on('connection', (socket) => {
	console.log(' --------------------- User connected ------------------------');
	//var userId = socket.request .request.session.passport.user;
	//let userDiscordID = Date.now();
	let discordID = socket.request.user.id;
	//Send a status update to the client (is a sound playing ?)
	socket.emit('statusUpdate', {playing: playing});

	//Send list of sounds to client
	socket.emit('updateSounds', {sounds: client.sounds});

	//Receive Play Sound event
	socket.on('playSoundEvent', (path, volume) => {
		let voiceChannels = (client.channels.cache.filter(item => item.type === 'voice'));
		let userFound = false;

		for(let channel of voiceChannels){
			for(let member of channel[1].members){
				if(member[0] === discordID){
					userFound = true;
					voiceChannel = channel[1];
					break;
				}
			}
			if(userFound)
				break;
		}

		
		//Is a voice connection existing ? If not, connect it
		if(userFound){
			let delay = 0;
			if(client.voice.connections.size > 0){
				if(client.voice.connections.first().channel.id !== voiceChannel.id){
					voiceChannel.join();
					delay = 400;
				}
			}
			else{
				voiceChannel.join();
				delay = 400;
			}
	
	
			// Timeout when bot joins the channel, to avoid cut sound
			setTimeout(() => { 
				// Play an Ogg Opus stream
				const dispatcher = client.voice.connections.first().play(fs.createReadStream(process.env.SOUNDS_FOLDER+path), { type: 'ogg/opus', volume: volume / 10 });
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
					//console.log('Set Var to : '+lastSoundPlayedAt);
				});
	
				dispatcher.on('error', console.error);
			}, delay);
		}
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
	
	//Receive sound uploaded event and send update sound to all clients
	socket.on('soundUploaded', () => {
		io.emit('updateSounds', {sounds: client.sounds});
	});
	
	//Receive sound uploaded event and send update sound to all clients
	socket.on('updateSoundVolume', (name, volume) => {
		let sound = require(process.env.SOUNDS_FOLDER+name+'.json');
		sound.volume = volume;
		let data = JSON.stringify(sound);
		fs.writeFileSync(process.env.SOUNDS_FOLDER+name+'.json', data);
		client.sounds.set(sound.id, sound);
		io.emit('updateSounds', {sounds: client.sounds});
	});

	socket.on('userSettingsUpdated', async () => {
		var test = await getAllSounds();
		io.emit('updateSounds', {sounds: client.sounds});
	});

	//Receive "disconnect" event from client : Someone closed the webapp
	socket.on('disconnect', () => {
		console.log(' - User disconnected');
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