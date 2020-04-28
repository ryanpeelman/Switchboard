import React from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import { userService } from '../services/userService';
import Welcome from './Welcome';

class HomePage extends React.Component {
	static navigationOptions = {
		title: 'Home',
	};

	constructor() {
		super();

		this.state = {
			currentUser: null
		};

		this.logout = this.logout.bind(this);
		this.setUser = this.setUser.bind(this);
	}

	render() {
		if (!this.props.currentUser) {
			return null;
		}

		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Welcome currentUser={this.props.currentUser} onSignOut={this.logout} />
				</View>
				<View style={styles.body}>
					<DeviceEntryForm currentUser={this.props.currentUser} />
				</View>
			</View>
		);
	}

	logout() {
		userService.logout();
		this.setUser(null);
	}

	setUser(user) {
		this.setState({ currentUser: user });
	}
}

class DeviceEntryForm extends React.Component {
	constructor() {
		super();

		this.state = {
			deviceid: '',
			heartrate: '',
			steps: ''
		};

		this.addEvent = this.addEvent.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleGenerate = this.handleGenerate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	render() {
		return (
			<View style={deviceEntryFormStyles.container}>
				<Text style={deviceEntryFormStyles.instructions}>Enter values below to submit a simulated reading</Text>
				<TextInput
					placeholder="Device ID"
					value={this.state.deviceid}
					onChangeText={(text) => this.setState({ deviceid: text })}
					style={deviceEntryFormStyles.entry}
				/>
				<TextInput
					placeholder="Current heart rate?"
					value={this.state.heartrate}
					onChangeText={(text) => this.setState({ heartrate: text })}
					style={deviceEntryFormStyles.entry}
				/>
				<TextInput
					placeholder="Current daily step count?"
					value={this.state.steps}
					onChangeText={(text) => this.setState({ steps: text })}
					style={deviceEntryFormStyles.entry}
				/>
				<View style={deviceEntryFormStyles.buttonContainer}>
					<Button
						title="Generate"
						accessibilityLabel="Generate"
						style={deviceEntryFormStyles.button}
						onPress={this.handleGenerate}
					/>
					<Button
						title="Submit"
						accessibilityLabel="Submit"
						style={deviceEntryFormStyles.button}
						onPress={this.handleSubmit}
					/>
				</View>
			</View>
		);
	}

	addEvent(event) {
		fetch('https://us-central1-devicedatamirror.cloudfunctions.net/api/events', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(event)
		}).catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode + ":  " + errorMessage);
		});
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleGenerate(e) {
		e.preventDefault();

		var deviceid = '10105';
		
		const minHeartRate = 70;
		const maxHeartRate = 90;
		var heartrate = (Math.floor(Math.random() * (maxHeartRate - minHeartRate + 1) + minHeartRate)).toString();

		const currentSteps = 4550;
		const minSteps = 1;
		const maxSteps = 100;
		var steps = (currentSteps + Math.floor(Math.random() * (maxSteps - minSteps + 1) + minSteps)).toString();

		this.setState({
			deviceid: deviceid,
			heartrate: heartrate,
			steps: steps
		});
	}

	handleSubmit(e) {
		e.preventDefault();

		let uid = this.props.currentUser.uid;

		const event = {
			userid: uid,
			deviceid: this.state.deviceid,
			datetime: Date.now(),
			heartrate: this.state.heartrate,
			steps: this.state.steps
		}
		this.addEvent(event);

		this.setState({
			deviceid: '',
			heartrate: '',
			steps: ''
		});
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center', 
		flex: 1, 
		padding: 10
	},
	header: {
	}, 
	body: { 
		flex: 1
	}
});

const deviceEntryFormStyles = StyleSheet.create({	
	container: {
		flex: 1,
		padding: 10
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	button: {
		backgroundColor: '#297DFD',
		borderRadius: 4,
		color: '#FFFFFF',
		flex: 1
	},
	entry: {
		flex: 1,
		maxHeight: 75
	}, 
	instructions: {
		fontSize: 24
	}
});

export default withMappedNavigationProps()(HomePage);