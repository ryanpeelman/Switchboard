import firebase from './firebase';
import PopupService from './PopupService';


export default class UserService {
	constructor() {
		this.popupService = new PopupService();
	}

	decorateUserWithCustomProperties(user) {
		//get database values (wait for response)
		return firebase.database().ref('userInfo').once('value').then((snapshot) => {
			var userInfo = null;

			if (snapshot.hasChild(user.uid)) {
				userInfo = snapshot.child(user.uid).val();
			}
			else {
				if (snapshot.hasChild('default')) {
					this.handleError("Could not find custom user properties in Firebase database, resorting to default");
					userInfo = snapshot.child('default').val();
				}
				else {
					this.handleError("Could not find custom or default user properties in Firebase database");
					return user;
				}
			}

			//set custom properties on user (only the publicly-available data)
			user.isPatientGuide = userInfo.isPatientGuide;
			user.isAdmin = userInfo.isAdmin;
			user.profileImage = userInfo.profileImage;
			user.profileImageSmall = userInfo.profileImageSmall;
			user.role = user.isAdmin ? "Admin" : (userInfo.isPatientGuide ? "Patient Guide" : "Patient");

			return user;
		});
	}

	handleError(error) {
		var errorCode = error.code;
		var errorMessage = error.message;

		console.log(errorCode + ":  " + errorMessage);
		//this.popupService.showError(errorCode + ":  " + errorMessage, "User Service Error");
	}

	login(email, password, callback) {
		var self = this;
		firebase.auth().signInWithEmailAndPassword(email, password)
		.then((user) => {
			self.decorateUserWithCustomProperties(user)
			.then((user) => {
				callback(user);
			})
		})
		.catch(function (error) {
			self.handleError(error);
		});
	}

	logout() {
		var self = this;
		firebase.auth().signOut().catch(function (error) {
			self.handleError(error);
		});
	}

	register(displayName, email, password, callback) {
		var self = this;
		firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
			user.updateProfile({
				displayName: displayName
			}).then(function () {
				callback(user);
			}, function (error) {
				self.handleError(error);
			});
		}).catch(function (error) {
			self.handleError(error);
		});
	}
}