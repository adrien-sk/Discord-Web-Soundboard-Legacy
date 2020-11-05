import React from 'react';

const Login = () => {

	/*const _handleSignInClick = () => {
	  // Authenticate using via passport api in the backend
	  // Open Twitter login page
	  // Upon successful login, a cookie session will be stored in the client
	  window.open("http://localhost:5000/auth", "_self");
	};*/
	

	return(
		<div>
			<h1>Login : Please authenticate</h1>
			<p><a href="http://localhost:5000/auth" className="btn">Dev Auth</a></p>
		</div>
	);
}

export default Login;