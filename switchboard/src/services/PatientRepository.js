import firebase from './firebase';


export default class PatientRepository {
    constructor(onLoadCallback) {
        this.patients = [];

        firebase.database().ref('userInfo').once('value', (snapshot) => {
            snapshot.forEach((userInfo) => {
                const patient = snapshot.child(userInfo.key).val();

                if (!patient.isPatientGuide && !patient.isAdmin && userInfo.key !== "default") {
                    patient.uid = userInfo.key;

                    //convert visits from JSON list to JS array
                    var visitArray = [];
                    for (var i in patient.visits) {
                        visitArray.push(patient.visits[i]);
                    }
                    patient.visits = visitArray;

                    //save patient
                    this.patients.push(patient);
                }
            });

            if(onLoadCallback) {
                onLoadCallback(this.patients);
            }
        });
    };

    getAllPatients() {
        return this.patients;
    }

    getPatient(patientId) {
        for (let key in this.patients) {
            if (this.patients[key].uid === patientId) {
                return this.patients[key];
            }
        }

        return null;
    }
}