import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class Welcome extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Hello, {this.props.currentUser.displayName}!</Text>
                <TouchableOpacity style={styles.button} onPress={this.props.onSignOut}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',  
        justifyContent: 'space-between'
    },
    button: {
        flex: 1
    },
    buttonText: {
        color: '#2179FF'
    }, 
    text: {
        flex: 4
    }
});