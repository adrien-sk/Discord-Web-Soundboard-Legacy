import React from 'react';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient({transports: ['websocket']});

class Header extends React.Component{
	render(){
		return(
			<header>
				<i className="fab fa-discord logo"></i>
				<h1>Discord Web Soundboard</h1>
			</header>
		);
	}
}

class Footer extends React.Component{
	render(){
		return(
			<footer>
				<p>Discord Web Sounboard</p>
				<a href="https://github.com/Nadrielle/Discord-Web-Soundboard" target="_blank"><i class="fab fa-github"></i> Source Code</a>
			</footer>
		);
	}
}

class Sound extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<a href="#" className="sound" disabled={this.props.playing} onClick={this.props.playSound}>{this.props.description}</a>
		);
	}
}

class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			soundPlaying: true,
			sounds: {}
		};

		this.playSound = this.playSound.bind(this);
	}

	componentDidMount(){
		socket.on('statusUpdate', (data) => {
			this.setState({soundPlaying: data.playing});
		});
		socket.on('updateSounds', (data) => {
			this.setState({sounds: data.sounds});
		});
	}

	playSound(event, sound){
		event.preventDefault();
		socket.emit('playSoundEvent', sound.id+sound.extension);
	}

	stopAllSound(event){
		event.preventDefault();
		socket.emit('stopAllSoundEvent');
	}

	renderButton(sound){
		return(
			<Sound /*disabled={this.state.soundPlaying}*/ key={sound.id} description={sound.description} playSound={(event) => this.playSound(event, sound)} />
		);
	}

	render(){
		const sounds = this.state.sounds;
		const buttons = Object.values(sounds).map((sound) => {
			return(
				this.renderButton(sound)
			);
		});

		return (
			<div id='page-container'>
				<Header />
				<main>
					{/*<a href="#" className="stop-sound" onClick={(event) => this.stopAllSound(event)}>Stop Sound</a>*/ }
					<div id="buttons">
						{buttons}
					</div>
				</main>
				<Footer />
			</div>
		);
	}	
}

export default App;
