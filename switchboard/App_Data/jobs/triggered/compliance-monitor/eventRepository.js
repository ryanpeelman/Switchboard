const fetch = require('node-fetch');

class EventRepository {
    getLatestEventPromise(user, eventType) {
        return fetch('https://us-central1-devicedatamirror.cloudfunctions.net/api/userevents/' + user.userId)
        .then(res => res.json())
        .then(events => {
            const mapped = this.getMappedDataFromSource(events, eventType);
            return {
                user: user, 
                latestEvent: mapped[0]
            };
        });
    }

    getMappedDataFromSource(sourceEvents, eventType) {
        let events = [];
        for (let eventKey in sourceEvents) {
            var event = sourceEvents[eventKey];

            if (event.hasOwnProperty(eventType) && event[eventType]) {
                events.push({
                    id: event,
                    userid: event.userid,
                    datetimeasval: event.datetime
                });
            }
        }

        var sorted = events.sort(function (a, b) {
            return b.datetimeasval - a.datetimeasval;
        });

        return sorted;
    };
}

module.exports = new EventRepository();