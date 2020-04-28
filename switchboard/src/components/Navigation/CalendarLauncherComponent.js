import React from 'react';
import ReactSVG from 'react-svg';

import calendar from '../../assets/026 Calendar.svg';

export default class CalendarLauncherComponent extends React.Component {
	render() {
		return (
			<div className="CalendarLauncherComponent">
				<button className="calendarButton">
					<ReactSVG path={calendar} className='calendarIcon' />
				</button>
			</div>
		);
	}
}