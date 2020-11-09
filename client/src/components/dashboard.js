import React from 'react';

class Sound extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="sound-wrapper">
				<a href="#" className="sound btn" disabled={this.props.playing} onClick={this.props.playSound}>{this.props.description}</a>
				<input data-name={this.props.name} type="range" min="0" max="40" defaultValue={this.props.volume} className="slider" onChange={this.props.volumeChangeHandler} />
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

class Dashboard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			soundPlaying: true,
			fileToUpload: null,
			fileTitleToUpload: null,
			formError: null,
			sounds: {}
		};

		this.socket = props.socket;

		this.playSound = this.playSound.bind(this);
		this.onFileChangeHandler = this.onFileChangeHandler.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.onFileTitleChangeHandler = this.onFileTitleChangeHandler.bind(this);
		this.onVolumeChangeHandler = this.onVolumeChangeHandler.bind(this);
	}

	componentDidMount(){
		this.socket.on('statusUpdate', (data) => {
			this.setState({soundPlaying: data.playing});
		});
		this.socket.on('updateSounds', (data) => {
			this.setState({sounds: data.sounds});
		});
		// Get users categories
		/*fetch("http://localhost:5000/api/getusercategories", {
			method: 'GET',
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			}}
		).then(res => {
			console.log(res)
		}).catch(err => {
			console.log(err);
		});
		// Get users sounds
		fetch("http://localhost:5000/api/getusersounds", {
			method: 'GET',
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			}}
		).then(res => {
			console.log(res)
		}).catch(err => {
			console.log(err);
		});*/
	}

	playSound(event, sound){
		event.preventDefault();
		this.socket.emit('playSoundEvent', sound.file_name, '10'/*sound.volume*/);
	}

	stopAllSound(event){
		event.preventDefault();
		this.socket.emit('stopAllSound');
	}

	onFileChangeHandler(event){
		this.setState({fileToUpload: event.target.files[0]});
	}

	onFileTitleChangeHandler(event){
		this.setState({fileTitleToUpload: event.target.value});
	}

	onVolumeChangeHandler(event){
		this.socket.emit('updateSoundVolume', event.target.dataset.name, event.target.value);
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
					this.socket.emit('soundUploaded');
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

	displayVolumes(){
		var element = document.getElementById("buttons");
		element.classList.toggle("hide-volume");
	}

	renderButton(sound){
		return(
			<Sound /*disabled={this.state.soundPlaying}*/ key={sound.id} name={sound.file_name} description={sound.display_name} playSound={(event) => this.playSound(event, sound)} volume='10'/*{sound.volume}*/ volumeChangeHandler={this.onVolumeChangeHandler} />
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
			<main>
				<div className="volume-wrapper">
					<i className="fas fa-volume-up fa-2x" onClick={this.displayVolumes}></i>
				</div>
				{<a href="#" className="stop-sound" onClick={(event) => this.stopAllSound(event)}>Stop Sound</a>}
				<div id="buttons" className="hide-volume">
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
		);
	}	
}

export default Dashboard;