const express = require('express');
const app = express();
const server = app.listen(port, () => console.log(`Server started on port ${process.env.PORT}`));
const io = require('socket.io').listen(server);

const Discord = require('discord.js');
const client = new Discord.Client();

let playing = false;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  let channel = client.channels.cache.get("534000212184793100");
  channel.send('Hello, I\'m Connected !');
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});


client.login(process.env.DISCORD_KEY);

//Receive "connection" event from client
io.on('connection', (socket) => {
	console.log('A user connected !');
	
	//Send "message" event to the client
	socket.emit('statusUpdate', {playing: playing});

	socket.on('playSound', (socket) => {
		console.log('-> Sound played');
		let channel = client.channels.cache.get("534000212184793100");
		channel.send('Playing the sound from button !');
		playing = true;
		io.emit('statusUpdate', {playing: playing});
		setTimeout(() => {
			playing = false;
			console.log('---> Sound Finished');
			io.emit('statusUpdate', {playing: playing});
		}, 3000);
	});

	socket.on('disconnect', () => {
		console.log(' - User disconnected');
	});
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});
