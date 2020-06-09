import React from 'react';
import socketIOClient from 'socket.io-client';

import logo from './logo.svg';
import './App.css';

const socket = socketIOClient({
	transports: ['websocket']
  });

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
			this.setState({soundPlaying: data.playing});
		});
	}

	playSound(){
		socket.emit('playSound');
	}

	render(){
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<button disabled={this.state.soundPlaying} onClick={this.playSound}>Play a sound</button>
				</header>
			</div>
		);
	}	
}

export default App;
