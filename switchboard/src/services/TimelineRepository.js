import moment from 'moment';

export default class TimelineRepository {
    getTimelineEvents() {
		//const twoWeeksAgoAndFourDays = moment().subtract(18, 'days').format("DD-MMM-YYYY");
		const twoWeeksAgoAndThreeDays = moment().subtract(17, 'days').format("DD-MMM-YYYY");
		const twoWeeksAgoAndOneDay = moment().subtract(15, 'days').format("DD-MMM-YYYY");
		const twoWeeksAgo = moment().subtract(14, 'days').format("DD-MMM-YYYY");
		const today = moment().format("DD-MMM-YYYY");

		return [
			//{ name: "Screening Visit", type: "Visit", date: twoWeeksAgoAndFourDays, completed: true, status: 'Completed' },
			{ name: "Randomization", type: "Milestone", date: twoWeeksAgoAndThreeDays, completed: true, status: 'Completed' },
			{ name: "Study Kit Delivered", type: "Kit", date: twoWeeksAgoAndOneDay, completed: true, status: 'Received' }, 
			{ name: "Study Visit 1", type: "Visit", date: twoWeeksAgo, completed: true, status: 'Completed' },
			{ name: "Study Visit 2", type: "Visit", date: today, completed: false, status: 'Scheduled' }, 
			{ name: "Study Visit 3", type: "Visit", date: "TBD", completed: false, status: 'Not Started' }
		];
    }
}