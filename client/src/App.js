import React from 'react';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Header from './components/header';
import Footer from './components/footer';
import socketIOClient from 'socket.io-client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			authenticated: false,
			socket: null
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
				socket: socketIOClient({transports: ['websocket']})
				//user: responseJson.user
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
				<div id='page-container'>
					<Header />
						{this.state.authenticated ? (
							<Dashboard socket={this.state.socket} />
						) : (
							<Login />
						)}
					<Footer />
				</div>
			</DndProvider>
		);
	}
}



export default App;
