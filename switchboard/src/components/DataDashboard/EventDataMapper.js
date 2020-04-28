import moment from 'moment';

export default class EventDataMapper {
    static getMappedData(events, eventDataType) {
        var eventData;
        if (eventDataType === 'heartrate') {
            eventData = this.mapHeartRateEvents(events);
        }
        else if (eventDataType === 'pillcompliance') {
            eventData = this.mapPillComplianceEvents(events);
        }
        else if (eventDataType === 'spirometry') {
            eventData = this.mapSpirometryEvents(events);
        }
        else {
            eventData = this.mapDefaultEvents(events);
        }

        return eventData;
    }

    static getMappedDataFromSource(sourceEvents) {
        let events = [];
        for (let eventKey in sourceEvents) {
            var event = sourceEvents[eventKey];

            events.push({
                key: eventKey, 
                id: event,
                userid: event.userid,
                deviceid: event.deviceid,
                datetimeasval: event.datetime,
                datetime: new Date(event.datetime).toLocaleString('en-US'),
                heartrate: event.heartrate,
                steps: event.steps,
                pilltaken: event.pilltaken,
                fev1: event.fev1,
                fvc: event.fvc,
                flow: event.flow
            });
        }

        var sorted = events.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.datetimeasval - b.datetimeasval;
        });

        return sorted;
    }

    static mapDefaultEvents(events) {
        return this.mapHeartRateEvents(events);
    }

    static mapHeartRateEvents(events) {
        var heartrateEvents = events.filter(event => { return event.hasOwnProperty("heartrate") && event.heartrate });

        return heartrateEvents.map(function (event) {
            var eventDateTime = new Date(event.datetime);
            var eventDateTimeString = moment(eventDateTime).format("MM/DD HH:mm:ss");
            return { datetime: eventDateTimeString, heartrate: parseInt(event.heartrate, 10), datetimeasval: event.datetimeasval };
        });
    }

    static mapPillComplianceEvents(events) {
        var pillcomplianceEvents = events.filter(event => { return event.hasOwnProperty("pilltaken") && event.pilltaken });

        var eventDataInTheLastSevenDays = pillcomplianceEvents.filter(event => {
            var eventDateTime = new Date(event.datetime);
            return moment(eventDateTime).isAfter(moment().startOf('day').add(-7, 'days'))
        });

        var eventData = [];

        var amRecordComparisonFunction = (event) => moment(new Date(event.datetime)).format("MM/DD A") === amDateTimeKey;
        var pmRecordComparisonFunction = (event) => moment(new Date(event.datetime)).format("MM/DD A") === pmDateTimeKey;

        var i;
        for (i = 0; i < 7; i++) {
            var startOfDay = moment().startOf('day').add((-1 * i), 'days');

            var amDateTimeKey = startOfDay.format("MM/DD") + " AM";
            var amRecords = eventDataInTheLastSevenDays.filter(event => amRecordComparisonFunction(event));
            var amRecord = (amRecords.length > 0) ? amRecords[0] : null;

            eventData.push({
                eventDateTime: amRecord ? new Date(amRecord.datetime) : startOfDay,
                datetime: amDateTimeKey,
                pilltaken: amRecord ? amRecord.pilltaken : 0
            });

            var pmDateTimeKey = startOfDay.format("MM/DD") + " PM";
            var pmRecords = eventDataInTheLastSevenDays.filter(event => pmRecordComparisonFunction(event));
            var pmRecord = (pmRecords.length > 0) ? pmRecords[0] : null;

            eventData.push({
                eventDateTime: pmRecord ? new Date(pmRecord.datetime) : startOfDay.add(12, 'hours'),
                datetime: pmDateTimeKey,
                pilltaken: pmRecord ? pmRecord.pilltaken : 0
            });
        }

        return eventData;
    }

    static mapSpirometryEvents(events) {
        const datetimeFormat = "DD-MMM-YYYY";

        var eventData = [];

        var spirometryEvents = events.filter(event => { return event.hasOwnProperty("flow") && event.flow });

        var eventDataInTheLastTwoWeeks = spirometryEvents.filter(event => {
            var eventDateTime = new Date(event.datetime);
            return moment(eventDateTime).isAfter(moment().startOf('day').add(-2, 'weeks'))
        });

        eventDataInTheLastTwoWeeks.forEach(record => {
            var datetime = new Date(record.datetime);
            eventData.push({
                eventDateTime: datetime,
                datetime: moment(datetime).format(datetimeFormat),
                datetimeasval: record.datetimeasval,
                fev1: record.fev1,
                fvc: record.fvc,
                ratio: record.fev1 / record.fvc,
                flow: record.flow
            });
        });

        return eventData;
    }
}