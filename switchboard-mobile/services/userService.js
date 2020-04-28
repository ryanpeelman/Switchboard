import { auth } from './firebase';

export const userService = {
	login, 
	logout
}

function login(email, password, callback) {
	auth.signInWithEmailAndPassword(email, password).then((user) => {
		callback(user);			
	}).catch(function(error) {
		handleError(error);
	});
}

function logout() {
	auth.signOut().catch(function(error) {
		handleError(error);		
	});
}	
	
function handleError(error) {
	var errorCode = error.code;
	var errorMessage = error.message;
	console.log(errorCode + ":  " + errorMessage);
}