import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import UserService from './services/UserService';

import ApplicationContainer from './ApplicationContainer';
import LoginPage from './components/Login/LoginPage';

class App extends Component {
	constructor() {
		super();
		this.state = {
			currentUser: null
		}

		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.register = this.register.bind(this);
		this.setUser = this.setUser.bind(this);

		this.userService = new UserService();
	}

	render() {
		return (
			<div className="App">
				<ToastContainer hideProgressBar={true} />
				{!this.state.currentUser && <LoginPage onLogin={this.login} onRegistration={this.register} />}
				{this.state.currentUser && <ApplicationContainer currentUser={this.state.currentUser} onSignOut={this.logout} />}
			</div>
		);
	}

	login(email, password) {
		var self = this;
		function callback(user) {
			self.setUser(user);
		};

		this.userService.login(email, password, callback);
	}

	logout() {
		this.userService.logout();
		this.setUser(null);
	}

	register(displayName, email, password) {
		var self = this;
		function callback(user) {
			self.setUser(user);
		};

		this.userService.register(displayName, email, password, callback);
	}

	setUser(user) {
		this.setState({ currentUser: user });
	}
}

export default App;
