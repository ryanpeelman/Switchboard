import React from 'react';

export default class LoginForm extends React.Component {
	constructor() {
		super();

		this.handleLogin = this.handleLogin.bind(this);
	}

	render() {
		return (
			<form className="login-form" onSubmit={this.handleLogin}>
				<div className="formItems">
					<label htmlFor="email">Username</label>
					<input type="text" id="email" ref="username" />
					<label htmlFor="password">Password</label>
					<input type="password" id="password" ref="password" />
				</div>
				<button>Login</button>
				{/* <div className="message">Not registered? <div className="bLink" onClick={this.props.handleToggle}>Create an account</div></div> */}
			</form>
		);
	}

	handleLogin(e) {
		e.preventDefault()
		let username = this.refs.username.value
		let password = this.refs.password.value
		this.props.onLogin(username, password)
	}
}