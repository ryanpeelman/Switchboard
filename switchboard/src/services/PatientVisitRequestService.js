//a service to read/write the status of patient visit requests

import firebase from './firebase';


export default class PatientVisitRequestService {
    constructor() {
        this.dbRef = firebase.database().ref('televisitRequests');
    }

    addVisitListener(callbackFn) {
        //create a listener on the visit database; whenever the db changes callbackFn will be called
        return this.dbRef.on('value', (snapshot) => callbackFn(snapshot));
    }

    removeVisitListener(listenerRef) {
        this.dbRef.off('value', listenerRef);
    }

	newRequest(patientId)
	{
		let newRequest = {
			userid: patientId,
			status: 'serverCreated'
		};
	
		firebase.database().ref('televisitRequests').push(newRequest);
	}

    updateStatus(patientId, newStatus) {
        //find the object in firebase that corresponds to this patient's request and update it
        this.dbRef.orderByChild("userid").equalTo(patientId).once("value", snapshot => {
            snapshot.forEach(child => {

                //TODO: there has to be a better way to do this! child.val().update({...}) doesn't work
                firebase.database().ref('televisitRequests/' + child.key).update({status: newStatus})
            });
        });
    }

    getStatus(patientId) {
        const status = this.dbRef.orderByChild("userid").equalTo(patientId).once("value", snapshot => {
            snapshot.forEach(child => {
                //(there should only be one entry in this snapshot)
                return child.val().status;
            })
        });

        //TODO: this returns the above promise, not the actual result. Figure out how to return the result itself.
        return status;
    }

    clearRequests(patientId) {
        this.dbRef.orderByChild("userid").equalTo(patientId).once("value", snapshot => {
            snapshot.forEach((entry) => {
                this.dbRef.child(entry.key).remove();
            });
        });
    }
}