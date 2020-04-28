import React from 'react';

export default class RegistrationForm extends React.Component {
	constructor() {
		super();

		this.handleRegistration = this.handleRegistration.bind(this);
	}

	render() {
		return (
			<form className="register-form" onSubmit={this.handleRegistration}>
				<input type="text" ref="registrationDisplayName" placeholder="name" />
				<input type="text" ref="registrationEmailAddress" placeholder="email address" />
				<input type="password" ref="registrationPassword" placeholder="password" />
				<button>create</button>
				<div className="message">Already registered? <div className="bLink" onClick={this.props.handleToggle}>Sign In</div></div>
			</form>
		);
	}

	handleRegistration(e) {
		e.preventDefault()
		let registrationDisplayName = this.refs.registrationDisplayName.value
		let registrationEmailAddress = this.refs.registrationEmailAddress.value
		let registrationPassword = this.refs.registrationPassword.value
		this.props.onRegistration(registrationDisplayName, registrationEmailAddress, registrationPassword)

		this.props.handleToggle()
	}
}