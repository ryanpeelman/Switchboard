import React from 'react';

import LoginForm from './LoginForm';
//import RegistrationForm from './RegistrationForm';

export default class LoginPage extends React.Component {
	constructor() {
		super();

		this.state = {
			isRegistrationFormVisible: false
		}

		this.showLogin = this.showLogin.bind(this);
		this.showRegistration = this.showRegistration.bind(this);
	}

	render() {
		return (
			<div className='container loginPage'>
				<header className="App-header">
					<h1 className="App-title">IQVIA<span>TM</span> Study Hub</h1>
					<div className="bannerImage"></div>
				</header>
				<div className="LoginPage">
					
					<div className="form">
						<h2>Login</h2>
						{!this.state.isRegistrationFormVisible &&
							<LoginForm onLogin={this.props.onLogin} handleToggle={this.showRegistration} />}
						{/* {this.state.isRegistrationFormVisible &&
							<RegistrationForm onRegistration={this.props.onRegistration} handleToggle={this.showLogin} />} */}
					</div>
				</div>
				<div className="footer">Copyright &copy; 2018 IQVIA All Rights Reserved</div> 
			</div>
		);
	}

	showLogin() {
		this.setState({
			isRegistrationFormVisible: false
		})
	}

	showRegistration() {
		this.setState({
			isRegistrationFormVisible: true
		});
	}
}

