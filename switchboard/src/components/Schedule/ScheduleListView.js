import React from 'react';
import ReactSVG from 'react-svg';

import chevronLeft from '../../assets/051 Chevron Left.svg';
import chevronRight from '../../assets/052 Chevron Right.svg';

import ScheduleItem from './ScheduleItem';

export default class ScheduleListView extends React.Component {
	render() {
		if (!this.props.scheduleEntries) {
			return (<div><p>No Schedule Entries!</p></div>);
		}

		const launchTelevisitFunction = this.props.launchTelevisitFunction;

		const scheduleEntries = this.props.scheduleEntries;
		const scheduleItems = scheduleEntries.map((scheduleEntry, index) =>
			<ScheduleItem key={`item-${index}`} scheduleEntry={scheduleEntry} launchTelevisitFunction={launchTelevisitFunction} />
		);
		return (
			<div>
				<div className="scheduleHeader">
					<div>
						<button className="viewButton selected">Day</button>
						<button className="viewButton">Week</button>
					</div>
					<button className="dateShift"><ReactSVG path={chevronLeft} className='directional' /></button>
					<button className="scheduleDay">Today</button>
					<button className="dateShift"><ReactSVG path={chevronRight} className='directional' /></button>
				</div>
				<ul className="scheduleItems">{scheduleItems}</ul>
			</div>
		);
	}
}