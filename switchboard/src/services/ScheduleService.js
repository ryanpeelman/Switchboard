import moment from 'moment'
import POCHelperService from './POCHelperService';


export default class ScheduleService {

	//implement service as singleton
	static myInstance = null;
	static getInstance() {
		if (ScheduleService.myInstance == null) {
			ScheduleService.myInstance = new ScheduleService();
		}

		return ScheduleService.myInstance;
	}

	constructor() {
		this.scheduleEntries = [
			{
				timeframe: "9:30 AM - 10:30 AM",
				title: "Visit 2",
				attendees: "Helen Jones",
				state: 'present',
				study: 'ALZVS369',
				relatedPatientId: 'c5I3ttr5ThNZGXRQjIhVYS7iAOH2'
			},
			{
				timeframe: "11:00 AM - 12:00 PM",
				title: "Consent Session",
				attendees: "Loretta Ritter, Max McCrae",
				state: 'past',
				study: 'ALZVS369',
				relatedPatientId: 'xB8jZhUbfkRjW8N8iw7ZYS5c2QD3'
			},
			{
				timeframe: "4:00 PM - 5:00 PM",
				title: "Consent Session",
				attendees: "Erica Higgins, Max McCrae",
				state: 'future',
				study: 'SGSTK879',
				relatedPatientId: '000'
			}
		];

		this.scheduleUpdateCallbacks = [];
	}

	addScheduleUpdateCallback(callback) {
		this.scheduleUpdateCallbacks.push(callback);
	}

	removeScheduleUpdateCallback(callback) {
		for (let ind in this.scheduleUpdateCallbacks) {
			if (this.scheduleUpdateCallbacks[ind] === callback) {
				this.scheduleUpdateCallbacks.splice(ind, 1);
				break;
			}
		}
	}

	addScheduleEntry(entry) {
		this.doAddScheduleEntry(entry);

		for (let ind in this.scheduleUpdateCallbacks) {
			this.scheduleUpdateCallbacks[ind](this.scheduleEntries);
		}
	}

	doAddScheduleEntry(entry) {
		const entries = this.scheduleEntries;

		if (!entries || (entries.length < 1)) {
			entries.push(entry);
			return;
		}

		//insert new entry in proper position (keep sorted by timeframe)
		for (let ind in entries) {
			if (this.timeframeIsBefore(entries[ind].timeframe, entry.timeframe)) {
				continue;
			}

			//insert new entry at this index
			entries.splice(ind, 0, entry);
			return;
		}

		//add new entry to the end of the list
		entries.push(entry);
	}

	timeframeIsBefore(a, b) {
		//if any errors occur, return true. This means that the caller will ultimately add the new entry to the end of the list
		if ((a===null) || (b===null)) {
			return true;
		}

		//convert starting time of each entry into a moment object, using a dummy date
		const partsA = a.split(" - ");
		var aMoment = moment('1-1-18 ' + partsA[0], "MM-DD-YY HH:mm A");

		const partsB = b.split(" - ");
		var bMoment = moment('1-1-18 ' + partsB[0], "MM-DD-YY HH:mm A");

		//compare
		return (aMoment.diff(bMoment) < 0);
	}

	addComplianceScheduleEntry(moment) {
		//TODO: eventually we will accept parameters like the Patient Guide's user id, the attendees, etc.
		//      then we will query the Patient Guide's schedule for the first available time slot
		//      for now just hard-code everything except the time
		const timeFrame = moment.format("h:mm A") + " - " + moment.add(1, 'hours').format("h:mm A");

		this.addScheduleEntry(POCHelperService.createScheduleEntryForComplianceCheckIn(timeFrame));
	}

	getScheduleEntries() {
		return this.scheduleEntries;
	}
}