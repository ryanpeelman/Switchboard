import POCHelperService from './POCHelperService';

import firebase from './firebase';
import PopupService from './PopupService';


export default class TelevisitService {

    //implement service as singleton
    static myInstance = null;
    static getInstance() {
        if (TelevisitService.myInstance == null) {
            TelevisitService.myInstance = new TelevisitService();
        }

        return TelevisitService.myInstance;
    }

    constructor() {
        //this.SERVER_BASE_URL = "http://localhost:8080";
        this.SERVER_BASE_URL = "https://sds-tokbox.azurewebsites.net";
        this.popupService = new PopupService();

        this.joinSessionCallbacks = [];
    }

    handleError(errorMsg) {
        console.log(errorMsg);
        this.popupService.showError(errorMsg, "Televisit Service Error");
    }

    closeSession(patientId) {
        var myself = this;

        fetch(this.SERVER_BASE_URL + '/room/close/' + this.getRoomName(patientId))
            .catch(function (error) {
                myself.handleError('Could not close the session: ' + error.message);
            });
    }

    createSession(patientId, title, callback) {
        var myself = this;

        fetch(this.SERVER_BASE_URL + '/room/create/' + this.getRoomName(patientId) + '/' + title)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                callback(json);
            })
            .catch(function (error) {
                myself.handleError('Could not create the session: ' + error.message + ' --- is the session server online?');
                callback({ error: error.message });
            });
    }

    getRoomName(patientId) {
        return "Room_" + patientId;
    }

    isSessionAvailable(patientId, callback) {
        var myself = this;

        fetch(this.SERVER_BASE_URL + '/room/find/' + this.getRoomName(patientId))
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                var isSessionAvailable = (json.sessionId !== "") ? true : false;
                callback(isSessionAvailable);
            })
            .catch(function (error) {
                myself.handleError('Could not find the session: ' + error.message + ' --- is the session server online?');
            });
    }

    addJoinSessionCallback(callback) {
        this.joinSessionCallbacks.push(callback);
    }

    removeJoinSessionCallback(callback) {
        for (let ind in this.joinSessionCallbacks) {
            if (this.joinSessionCallbacks[ind] === callback) {
                this.joinSessionCallbacks.splice(ind, 1);
                break;
            }
        }
    }

    joinSession(patientId) {
        var myself = this;

        fetch(this.SERVER_BASE_URL + '/room/' + this.getRoomName(patientId))
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                //if error object returned, throw javascript exception so it will be caught below
                if (json.error) {
                    throw new Error(json.error);
                }

                //issue callbacks
                for (let ind in myself.joinSessionCallbacks) {
                    myself.joinSessionCallbacks[ind](json);
                }
            })
            .catch(function (error) {
                myself.handleError('Could not join the session: ' + error.message + ' --- is the session server online?');

                for (let ind in myself.joinSessionCallbacks) {
                    myself.joinSessionCallbacks[ind]({ error: error.message });
                }
            });
    }
/* TODO: this is no longer used
    requestSession(patient, callback) {
        //check if session already exists, otherwise request a new one
        const isSessionAvailableCallback = (isSessionAvailable) => {
            if (isSessionAvailable) {
                //Patient Guide has already created a session for the patient
                //create request to reflect that session is already created, which will be immediately handled on the Patient side
                let newRequest = {
                    userid: patient.uid,
                    status: 'sessionCreated'
                };

                firebase.database().ref('televisitRequests').push(newRequest);
            }
            else {
                //session does not already exist; create request
                let newRequest = {
                    userid: patient.uid,
                    status: 'clientRequested'
                };

                firebase.database().ref('televisitRequests').push(newRequest);

                this.popupService.showSuccess('Televisit session requested', 'Televisit Service Success Message');

                this.sendTelevisitFollowUpNotification(patient);
            }

            callback(patient.uid);
        };

        //issue command to check if session already exists
        this.isSessionAvailable(patient.uid, isSessionAvailableCallback);
    }
*/
    sendTelevisitFollowUpNotification(patient) {
        var patientGuideRecord = POCHelperService.getPatientGuideRecord();
        var recipientId = patientGuideRecord.uid;
        var televisitNotification = {
            message: "Televisit follow-up with " + patient.displayName,
            type: "TelevisitFollowUp",
            datetime: Date.now(), 
            acknowledged: false
        }
        const notificationsReference = firebase.database().ref('notifications/' + recipientId);
        notificationsReference.push(televisitNotification);
    }
}
