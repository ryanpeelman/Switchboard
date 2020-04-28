import moment from 'moment';

import firebase from './firebase';

export default class TaskRepository {
    constructor() {
        this.DATE_FORMAT = "DD-MMM-YYYY";

        const today = moment().format(this.DATE_FORMAT);
        
        this.defaultCategory = "Action Items";
        this.defaultStudy = "ALZVS369";
        this.defaultTasks = [
            { name: "Complete study medication diary", duedate: today, isOpen: true },
            { name: "Complete quality of life questionnaire", duedate: today, isOpen: true },
            { name: "Acknowledge delivery of Study Medication Kit", duedate: today, isOpen: true }
        ];
    }

    close() {
        firebase.database().ref('tasks').off();
    }

    getTasks(uid, callback) {
        if(!uid) {
            return this.defaultTasks;
        }
        
        const tasksReference = firebase.database().ref('tasks');
        const query = tasksReference.orderByChild('uid').equalTo(uid);
		query.on('value', (snapshot) => {
            let tasksVal = snapshot.val();
            
            let tasks = [];
			for (let key in tasksVal) {
                var task = tasksVal[key];
				tasks.push({
                    uid: task.uid, 
                    name: task.name, 
                    duedate: task.duedate, 
                    isOpen: task.isOpen, 
                    category: task.category ? task.category : this.defaultCategory, 
                    study: task.study ? task.study : this.defaultStudy, 
                    relatedPatientId: task.relatedPatientId, 
                    poc_duedateid: task.poc_duedateid  
				});
            }

            var sorted = tasks.sort((a, b) => {
                return moment(a.duedate, this.DATE_FORMAT).isAfter(moment(b.duedate, this.DATE_FORMAT));
            });

            callback(sorted);
		});
    }
}