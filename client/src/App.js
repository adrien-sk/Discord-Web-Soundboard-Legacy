import React from 'react';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient({transports: ['websocket']});

class Sound extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<button disabled={this.props.playing} onClick={this.props.playSound}>{this.props.name}</button>
		);
	}
}

class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			soundPlaying: true
		};

		this.playSound = this.playSound.bind(this);
	}

	componentDidMount(){
		socket.on('statusUpdate', (data) => {
			console.log("Status update : "+ data.playing);
			this.setState({soundPlaying: data.playing});
		});
	}

	playSound(path){
		console.log('emit playsound');
		socket.emit('playSoundEvent', path);
	}

	stopAllSound(){
		socket.emit('stopAllSoundEvent');
	}

	renderButton(path, name){
		return(
			<Sound /*disabled={this.state.soundPlaying}*/ path={path} name={name} playSound={() => this.playSound(path)} />
		);
	}

	render(){
		return (
			<main>
				{/*<Header />*/}
					{this.renderButton('./sounds/aller_viens_gamin.mp3', 'GAMIN, REVIENS GAMIN !')}
					{this.renderButton('./sounds/jémal.mp3', 'J\'ai maaal !')}
					<p>playing : {this.state.soundPlaying ? 'Playing' : 'Silent'}</p>
				{/*<Footer />*/}
			</main>
		);
	}	
}

export default App;
