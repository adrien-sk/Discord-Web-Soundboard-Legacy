import React from 'react';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient({transports: ['websocket']});

class Sound extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<button disabled={this.props.playing} onClick={this.props.playSound}>{this.props.description}</button>
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
			console.log('------ Status update started -------')
			this.setState({soundPlaying: data.playing});
			console.log('------ Status update ended -------')
		});
		socket.on('updateSounds', (data) => {
			console.log('------ updateSounds started -------')
			this.setState({sounds: data.sounds});
			console.log('------ updateSounds ended -------')
		});
	}

	playSound(sound){
		console.log('-------------- sound : '+sound.id+sound.extension+'----------------');
		console.log(sound);
		socket.emit('playSoundEvent', sound.id+sound.extension);
	}

	stopAllSound(){
		socket.emit('stopAllSoundEvent');
	}

	renderButton(sound){
		return(
			<Sound /*disabled={this.state.soundPlaying}*/ key={sound.id} description={sound.description} playSound={() => this.playSound(sound)} />
		);
	}

	render(){
		const sounds = this.state.sounds;
		const buttons = Object.values(sounds).map((sound) => {
			/*console.log('-------------- sound ----------------')
			console.log(sound)
			console.log('-------------------------------------')*/
			return(
				this.renderButton(sound)
			);
		});

		return (
			<main>
				{/*<Header />*/}
					{buttons}
				{/*<Footer />*/}
			</main>
		);
	}	
}

export default App;
