
class Notifier { 
    constructor(database) {
        this.database = database;
    }

    buildValidationFailureNotification(event) {
        const getUserDisplayName = function (userid) {
            if (userid === 'c5I3ttr5ThNZGXRQjIhVYS7iAOH2') {
                return "Helen Jones";
            }
            else if (userid === 'xB8jZhUbfkRjW8N8iw7ZYS5c2QD3') {
                return "Loretta Ritter";
            }
    
            return userid;
        }
        
        const patientDisplayName = getUserDisplayName(event.userid);
        const message = "Event entry alert for " + patientDisplayName + " - (Heart Rate = " + event.heartrate + ")";
        var notification = {
            message: message,
            type: "EventEntryAlert",
            datetime: Date.now(),
            acknowledged: false, 
            relatedPatientId: event.userid
        }

        return notification;
    }

    sendValidationFailureNotification(recipientId, event) {
        const notification = this.buildValidationFailureNotification(event);

        const notificationsReference = this.database.ref('notifications/' + recipientId);
        notificationsReference.push(notification);
    }
}

module.exports = database => new Notifier(database);