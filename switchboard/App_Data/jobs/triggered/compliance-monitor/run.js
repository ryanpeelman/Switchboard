const fs = require('fs');
const moment = require('moment');
const path = require('path');

const eventRepository = require('./EventRepository');
const notifier = require('./Notifier');

var run = function () {
    var filepath = path.join(path.dirname(fs.realpathSync(__filename)), '/notified.json');
    var data = fs.readFileSync(filepath, 'utf8');
    var notified = (data) ? JSON.parse(data) : {};

    const usersToMonitor = [
        { userId: "c5I3ttr5ThNZGXRQjIhVYS7iAOH2", displayName: "Helen Jones", patientGuideId: "ahnFuBrWmeb0Tfa3PME3xzYj8pS2" },
        // { userId: "xB8jZhUbfkRjW8N8iw7ZYS5c2QD3", displayName: "Loretta Ritter", patientGuideId: "ahnFuBrWmeb0Tfa3PME3xzYj8pS2" }
    ];

    const markAsNotified = function (user) {
        notified[user.userId] = Date.now();
        fs.writeFile(filepath, JSON.stringify(notified), 'utf8');
    }

    const checkForRecentEvent = function (latestEvent, user, complianceRule) {
        var isCompliant = false;

        if (latestEvent) {
            const complianceThreshold = moment().subtract(24, 'hour');
            const latestEventDateTime = new Date(latestEvent.datetimeasval);
            isCompliant = moment(latestEventDateTime).isAfter(complianceThreshold);
        }

        if (!isCompliant) {
            const lastNotifiedDateTime = notified[user.userId];
            const hasBeenNotifiedToday = lastNotifiedDateTime && moment(lastNotifiedDateTime).isSame(new Date(), "day");
            if (!hasBeenNotifiedToday) {
                notifier.sendNotificationToPatientGuide(user, complianceRule);
                markAsNotified(user);
            }
        }
    }

    for (var key in usersToMonitor) {
        var user = usersToMonitor[key];
        //eventRepository.getLatestEventPromise(user, "heartrate").then(result => { checkForRecentEvent(result.latestEvent, result.user, "Heart Rate (2 hrs)"); });
        eventRepository.getLatestEventPromise(user, "flow").then(result => { checkForRecentEvent(result.latestEvent, result.user, "Spirometry (24 hrs)"); });
    }
};

run();