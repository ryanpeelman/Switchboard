import React from 'react';
import ReactSVG from 'react-svg';
import moment from 'moment';

import calendar from '../../assets/026 Calendar.svg';

import ScheduleListView from './ScheduleListView';
import ScheduleService from '../../services/ScheduleService';


export default class ScheduleComponent extends React.Component {
	constructor() {
		super();

		this.scheduleService = ScheduleService.getInstance();

		this.state = {
			scheduleEntries: []
		}
	}

	componentDidMount() {
		this.scheduleService.addScheduleUpdateCallback((scheduleEntries) => {
			this.setState({ scheduleEntries: scheduleEntries });
		});

		this.setState({ scheduleEntries: this.scheduleService.getScheduleEntries() });
	}

	render() {
		const launchTelevisitFunction = this.props.launchTelevisitFunction;

		const todayDate = moment().format("DD-MMM-YYYY");
		const todayDay = moment().format("dddd");

		return (
			<div className="ScheduleComponent">
				<div className="title"><p>My Schedule</p><ReactSVG path={calendar} className='calendar' /></div>
				<div className="today">
					<span className="date">{todayDate}</span>
					<span className="day">{todayDay}</span>
				</div>
				<ScheduleListView scheduleEntries={this.state.scheduleEntries} launchTelevisitFunction={launchTelevisitFunction} />
			</div>
		);
	}
}