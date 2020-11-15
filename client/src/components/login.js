import React from 'react';

const Login = () => {
	return(
		<div className="login-page">
			<h1>Discord Web Soundboard</h1>
			<img className="logo" src="/logo_soundboard.svg" alt="logo"/>
			<div className="login-box">
				<h2>Login</h2>
				<a href="http://localhost:5000/auth" className="btn">Authenticate with Discord</a>
			</div>
		</div>
	);
}

export default Login;