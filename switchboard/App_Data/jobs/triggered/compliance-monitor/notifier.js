const fetch = require('node-fetch');

class Notifier {
    buildComplianceNotification(user, complianceRule) {
        const message = "Schedule compliance follow-up with " + user.displayName + " - " + complianceRule;
        const notification = {
            userId: user.patientGuideId,
            notification: {
                type: "Compliance",
                message: message,
                datetime: Date.now(),
                acknowledged: false
            }
        }

        return notification;
    }

    sendNotificationToPatientGuide(user, complianceRule) {
        const notification = this.buildComplianceNotification(user, complianceRule);

        fetch('https://us-central1-devicedatamirror.cloudfunctions.net/api/notifications', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notification)
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ":  " + errorMessage);
        });
    }
}

module.exports = new Notifier();