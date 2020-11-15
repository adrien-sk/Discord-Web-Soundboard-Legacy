import React from 'react';
import Login from './components/login';
import Dashboard from './components/dashboard';
import socketIOClient from 'socket.io-client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			authenticated: false,
			socket: null,
			userId: null
		}
	}

	componentDidMount() {
		fetch("/auth/isloggedin", {
			method: "GET",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			}
		})
		.then(response => {
			if (response.status === 200) return response.json();
				throw new Error("failed to authenticate user");
		})
		.then(responseJson => {
			this.setState({
				authenticated: true,
				socket: socketIOClient({transports: ['websocket']}),
				userId: responseJson.userId
			});
		})
		.catch(error => {
			this.setState({
				authenticated: false
				//error: "Failed to authenticate user"
			});
		});
	}
	
	render(){
		return(
			<DndProvider backend={HTML5Backend}>
				{this.state.authenticated ? (
					<Dashboard socket={this.state.socket} userId={this.state.userId} />
				) : (
					<Login />
				)}
			</DndProvider>
		);
	}
}



export default App;
