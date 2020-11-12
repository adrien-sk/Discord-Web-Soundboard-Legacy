import React from 'react';
import UserBoard from './userBoard';
import Library from './library';

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

class Dashboard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			userId: props.userId,
			soundPlaying: true,
			fileToUpload: null,
			fileTitleToUpload: null,
			formError: null,
			sounds: [],
			userSounds: [],
			isLoaded: false
		};

		this.socket = props.socket;

		this.onFileChangeHandler = this.onFileChangeHandler.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.onFileTitleChangeHandler = this.onFileTitleChangeHandler.bind(this);
		this.onVolumeChangeHandler = this.onVolumeChangeHandler.bind(this);
		this.onRefreshUserSounds = this.onRefreshUserSounds.bind(this);
		this.playSound = this.playSound.bind(this);
		this.removeUserSoundHandler = this.removeUserSoundHandler.bind(this);
		this.onAddUserCategory = this.onAddUserCategory.bind(this);
		this.updateCategoryNameHandler = this.updateCategoryNameHandler.bind(this);
		this.deleteCategoryHandler = this.deleteCategoryHandler.bind(this);
	}

	async componentDidMount(){
		this.socket.on('statusUpdate', (data) => {
			this.setState({soundPlaying: data.playing});
		});
		this.socket.on('updateSounds', (data) => {
			this.setState({sounds: data.sounds});
		});
		
		this.onRefreshUserSounds();
	}

	playSound = (sound) => {
		console.log('Playing sound');
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

	onRefreshUserSounds = async () => {
		const responseSounds = await fetch(`http://localhost:5000/api/getusersoundsobject`, {
			method: 'GET',
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			}
		});
		console.log('--- refresh Sound ---');
		const jsonSounds = await responseSounds.json();
		this.setState({ userSounds: jsonSounds, isLoaded: true });
		this.socket.emit('userSettingsUpdated');
	}

	updateUserSoundHandler = async (type, userSoundId, newCategory) => {
		const requestUrl = type === 'user-sound' ? 'updateusersound' : 'addusersound';
		const responseSoundUpdate = await fetch(`http://localhost:5000/api/${requestUrl}`, {
			method: 'PUT',
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			},
			body: JSON.stringify({
				'userSoundId': userSoundId,
				'newCategory': newCategory
			})
		});
		this.onRefreshUserSounds();
	}	

	updateCategoryNameHandler = async (categoryId, newCategoryName) => {
		const responseSoundUpdate = await fetch(`http://localhost:5000/api/updatecategoryname`, {
			method: 'PUT',
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			},
			body: JSON.stringify({
				'categoryId': categoryId,
				'newCategoryName': newCategoryName
			})
		});
		this.onRefreshUserSounds();
	}

	removeUserSoundHandler = async (userSoundId) => {
		const responseSoundUpdate = await fetch(`http://localhost:5000/api/deleteusersound`, {
			method: 'DELETE',
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			},
			body: JSON.stringify({
				'userSoundId': userSoundId
			})
		});
		this.onRefreshUserSounds();
	}	

	onAddUserCategory = async () => {
		const responseNewCategory = await fetch(`http://localhost:5000/api/addusercategory`, {
			method: 'POST',
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			}
		});

		this.onRefreshUserSounds();
	}

	deleteCategoryHandler = async (categoryId) => {
		const responseDeleteCategory = await fetch(`http://localhost:5000/api/deleteusercategory`, {
			method: 'DELETE',
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			},
			body: JSON.stringify({
				'categoryId': categoryId
			})
		});

		this.onRefreshUserSounds();
	}

	displayVolumes(){
		var element = document.getElementById("buttons");
		element.classList.toggle("hide-volume");
	}

	// renderButton(sound){
	// 	return(
	// 		<Sound /*disabled={this.state.soundPlaying}*/ key={sound.id} name={sound.file_name} description={sound.display_name} playSound={(event) => this.playSound(event, sound)} volume='10'/*{sound.volume}*/ volumeChangeHandler={this.onVolumeChangeHandler} />
	// 	);
	// }

	render(){
		const fileTitle = this.state.fileTitleToUpload;
		const sounds = this.state.sounds;
		/*const buttons = Object.values(sounds).map((sound) => {
			return(
				this.renderButton(sound)
			);
		});*/
		const formErrorText = this.state.formError;
		const file = this.state.fileToUpload  ? this.state.fileToUpload.name : 'Click here or Drag a MP3/OGG file';

		return (
			<main>
				{ this.state.isLoaded && <UserBoard userSounds={this.state.userSounds} onUpdateSound={this.updateUserSoundHandler} playSound={this.playSound} onAddUserCategory={this.onAddUserCategory} onUpdateCategoryName={this.updateCategoryNameHandler} onDeleteCategory={this.deleteCategoryHandler} /> }
				<div className="volume-wrapper">
					<i className="fas fa-volume-up fa-2x" onClick={this.displayVolumes}></i>
				</div>
				{<a href="#" className="stop-sound" onClick={(event) => this.stopAllSound(event)}>Stop Sound</a>}
				<div id="buttons" className="hide-volume">
					<Library librarySounds={this.state.sounds} playSound={this.playSound} removeUserSoundHandler={this.removeUserSoundHandler} volumeChangeHandler={this.onVolumeChangeHandler} />
					{/* {buttons} */}
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