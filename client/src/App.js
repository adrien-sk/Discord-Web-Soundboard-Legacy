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
				<a href="https://github.com/Nadrielle/Discord-Web-Soundboard" target="_blank"><i className="fab fa-github"></i> Source Code</a>
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
			<div className="sound-wrapper">
				<a href="#" className="sound btn" disabled={this.props.playing} onClick={this.props.playSound}>{this.props.description}</a>
				<input type="range" min="0" max="40" defaultValue="10" className="slider"></input>
			</div>
		);
	}
}

class FileUpload extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div id="upload-form">
				<form method="post" action="#" id="#">
					<label>Upload Your File </label>
					<input type="text" name="title" />
					<input type="file" name="file" className="form-control" />
					<input type="submit" onClick={this.props.uploadFile} />
				</form>
			</div>
		);
	}
}

class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			soundPlaying: true,
			fileToUpload: null,
			fileTitleToUpload: null,
			formError: null,
			sounds: {}
		};

		this.playSound = this.playSound.bind(this);
		this.onFileChangeHandler = this.onFileChangeHandler.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.onFileTitleChangeHandler = this.onFileTitleChangeHandler.bind(this);
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
		socket.emit('stopAllSound');
	}

	onFileChangeHandler(event){
		this.setState({fileToUpload: event.target.files[0]});
	}

	onFileTitleChangeHandler(event){
		this.setState({fileTitleToUpload: event.target.value});
	}

	uploadFile(event){
		event.preventDefault();

		if(this.state.fileTitleToUpload === null || this.state.fileTitleToUpload === '' || this.state.fileToUpload === null){
			if((this.state.fileTitleToUpload === null || this.state.fileTitleToUpload === '') && this.state.fileToUpload === null){
				this.setState({formError: 'Please fill the Title and select a File'});
			}
			else if(this.state.fileToUpload === null){
				this.setState({formError: 'Please select a File'});
			}
			else{
				this.setState({formError: 'Please fill the Title'});
			}
		}
		else{
			if(this.state.fileToUpload.name.indexOf('mp3') != -1 || this.state.fileToUpload.name.indexOf('ogg') != -1){
				var formData = new FormData();
				formData.set('title', this.state.fileTitleToUpload);
				formData.append('sounds', this.state.fileToUpload);
				
				const options = {
					method: 'POST',
					body: formData
				};
		
				fetch("/upload", options).then(res => {
					socket.emit('soundUploaded');
				}).catch(err => {
					console.log(err);
				});

				this.setState({fileTitleToUpload: ''});
				this.setState({fileToUpload: null});
				this.setState({formError: ''});
			}
			else{
				this.setState({formError: 'Please upload an mp3 or ogg'});
			}
		}
	}

	renderButton(sound){
		return(
			<Sound /*disabled={this.state.soundPlaying}*/ key={sound.id} description={sound.description} playSound={(event) => this.playSound(event, sound)} />
		);
	}

	render(){
		const fileTitle = this.state.fileTitleToUpload;
		const sounds = this.state.sounds;
		const buttons = Object.values(sounds).map((sound) => {
			return(
				this.renderButton(sound)
			);
		});
		const formErrorText = this.state.formError;
		const file = this.state.fileToUpload  ? this.state.fileToUpload.name : 'Click here or Drag a MP3/OGG file';

		return (
			<div id='page-container'>
				<Header />
				<main>
					{<a href="#" className="stop-sound" onClick={(event) => this.stopAllSound(event)}>Stop Sound</a>}
					<div id="buttons">
						{buttons}
					</div>
					<div id="upload-form">
						<input required type="text" name="title" onChange={this.onFileTitleChangeHandler} value={fileTitle} className="form-control" placeholder="Sound title" />
						<div id="files-container">
							<input required type="file" name="file" className="files" onChange={this.onFileChangeHandler}/>
							<p>{file}</p>
						</div>
						<a href="#" onClick={this.uploadFile} className="btn">Upload</a>
						<p id="form-error">{formErrorText}</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}	
}

export default App;
