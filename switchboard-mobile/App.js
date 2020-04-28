import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

export default class App extends Component {
	render() {
		AppNavigator = StackNavigator(
			{
				App: HomePage,
				Auth: LoginPage,
			},
			{
				initialRouteName: 'Auth'
			}
		);

		return <AppNavigator />
	}
}
