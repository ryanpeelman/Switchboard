import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import { userService } from '../services/userService';

class LoginPage extends React.Component {
    static navigationOptions = {
        title: 'Sign In',
    };

	constructor() {
		super();

		this.login = this.login.bind(this);
	}

    render() {
        return (
            <View style={styles.container}>
                <LoginForm onLogin={this.login} />
            </View>
        );
    }

	login(email, password) {
		var self = this;
		function callback(user) {
			self.props.navigation.navigate('App', { currentUser: user });
		};

		userService.login(email, password, callback);
	}
}

class LoginForm extends React.Component {
    constructor() {
        super();

        this.state = {
            username: '',
            password: ''
        }

        this.handleLogin = this.handleLogin.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder="username"
                    value={this.state.username}
                    onChangeText={(text) => this.setState({ username: text })}
                    style={styles.entry}
                />
                <TextInput
                    placeholder="password"
                    value={this.state.password}
                    onChangeText={(text) => this.setState({ password: text })}
                    style={styles.entry}
                />
                <Button
                    title="Login"
                    accessibilityLabel="Login"
                    style={styles.button}
                    onPress={this.handleLogin}
                />
            </View>
        );
    }

    handleLogin(e) {
        e.preventDefault();
        let username = this.state.username;
        let password = this.state.password;
        this.props.onLogin(username, password);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: 10
    },
    button: {
        backgroundColor: '#297DFD',
        borderRadius: 4,
        color: '#FFFFFF',
        marginHorizontal: 'auto',
        height: 60,
        flex: 1
    },
    entry: {
        flex: 1,
        maxHeight: 75
    }
});

export default withMappedNavigationProps()(LoginPage);