import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<h1>Discord Web Soundboard</h1>
		);
	}
}


ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);