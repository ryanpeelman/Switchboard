import * as firebase from 'firebase'

const config = {
	apiKey: "AIzaSyBCDmL8sbCbk6mZfz5lRX9jkBVYlljR-Co",
	authDomain: "devicedatamirror.firebaseapp.com",
	databaseURL: "https://devicedatamirror.firebaseio.com",
	projectId: "devicedatamirror",
	storageBucket: "",
	messagingSenderId: "976010824146"
};
firebase.initializeApp(config);

export const auth = firebase.auth();