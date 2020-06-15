
<h1 align="center"> Discord Web Soundboard </h1> <br>
![Discord Web Soundboard](/doc/doc_header.jpg)


## Introduction
Simply and quickly connect a Bot to your Discord server, and make him play sounds and music of your choice by using a Web-interface. 
All your users will be able to play with sounds to emphasize funny discussion/gaming moments !


## Built with
* [React.JS](https://reactjs.org/) : 16.13.1 : React.JS is used to provide a quick one page web application.
* [Node.JS](https://nodejs.org) : 13.13.0 : Node.JS provide the back-end functionnalities of the applications.
* [Socket.IO](https://socket.io/) : 2.3.0 : Socket.IO allow us to easily and quickly share information between clients and our application functionnalities.
* [Discord.JS](https://discord.js.org) : 12.2.0 : Discord.JS is used for having a Bot playing required sound directly in your Discord server.
* [Express.JS](https://expressjs.com/) : 4.17.1 : Express.JS handles all our requests from the client
* [Formidable](https://www.npmjs.com/package/formidable) : 1.2.2 : Formidable is used to allow users to upload their own sounds
* [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static) : 4.2.2 : FFMPEG is used to convert **mp3** common files to **ogg** for optimisation
* [Dotenv](https://www.npmjs.com/package/dotenv) : 8.2.0 : Using Dotenv to manage environment variables from a .env file (eg: "password: process.env.DB_PASS")
* [Discordjs/opus](https://github.com/discordjs/opus) : 0.3.2 : 


## Local Setup
First of all, ensure you install [Node.JS](https://nodejs.org), and [Git](https://git-scm.com/) if you plan to clone the repository

```bash
# Clone this repository
$ git clone https://github.com/Nadrielle/Discord-Web-Soundboard.git

# Go into the repository
$ cd discord-web-soundboard

# Install dependencies
$ npm install
```

To Do : Create a wiki to explain how to create a bot on discord.com

You'll need to Create a .env file to store some variables as follow :
```
# Content of the .env file
PORT=5000
DISCORD_TOKEN=#MyDiscordToken(To do : Add a wiki link to explain)
SOUNDS_FOLDER="./sounds/"
VOICE_CHANNEL=#MyVoiceChannel(To do : Add a wiki link to explain)
```

You will need one command prombt to run the server, and one to run the react application

```
# Run the server script in one command prombt, in the 'discord-web-soundboard' folder
$ node server.js
```

```
# Run the react app in another command prombt, in the 'discord-web-soundboard/client' folder
$ npm start
```
The app should launch in your web browser at **localhost:3000/**

![Discord Web Soundboard](/doc/command_prombts.jpg)


## Features
* Listing as buttons of the sounds uploaded in the "./sounds" folder
* Playing of custom sounds by the Bot when clicking any button
* Upload functionality for MP3/OGG
* Usage of the bot in a predifined Discord channel


## Future features
* Discord Login integration (Could allow whitelisting, and detection of the user's channel when launching a sound)
* Visual display of the user launching the sound (We want to know who is spamming this annoying sound =D)
* Turn button of the playing sound to red : Another click on the button Stop the playing sound
* More to come ...


## Support
To do


## License
MIT
