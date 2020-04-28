import React from 'react';
import ReactSVG from 'react-svg';
import moment from 'moment'

import calendar from '../../assets/026 Calendar.svg';


export default class DateTimePickerComponent extends React.Component {
	constructor() {
		super();

		this.handleTimeSlotSelection = this.handleTimeSlotSelection.bind(this);
	}

	handleTimeSlotSelection(startHour) {
		const datetime = moment().startOf('day').add(startHour, 'hour');
		this.props.handleSave(datetime);
	}

	render() {
		const today = moment().startOf('day');
		const tomorrow = moment().add(1, 'day').startOf('day');
		
		const scheduleData = [
			{ day: today, timeslots: [18, 19] },
			{ day: tomorrow, timeslots: [10] }
		];

		const getTimeslots = (day, timeslots) => {			
			return timeslots.map((timeslot, index) => 
				<div class="timeslot" onClick={()=> this.handleTimeSlotSelection(timeslot)}>
					{moment(day).add(timeslot, 'hour').format("hh:mm a")}
					<span> - </span>
					{moment(day).add(timeslot+1, 'hour').format("hh:mm a")}
				</div>
			);
		};

		const days = scheduleData.map((item, index) => 
			<div className="day">
				<div className="dayOfWeek">{item.day.format("dddd")}</div>
				<div className="date">{item.day.format("DD-MMM-YYYY")}</div>				
				<div class="timeslots">{getTimeslots(item.day, item.timeslots)}</div>
			</div>
		);

		const RecommendedDatesAndTimesComponent =
			<div className="RecommendedDatesAndTimesComponent">
				<div className="title"><span>Recommended Dates and Times</span><ReactSVG path={calendar} className='calendar' /></div>
				{days}
			</div>;

		return (
			<div className="DateTimePickerComponent">
				<div className="scheduleMessage">
					The following are the next available timeslots to schedule:
				</div>
				{RecommendedDatesAndTimesComponent}
			</div>
		);
	}
}