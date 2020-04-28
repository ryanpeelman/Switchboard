import React from 'react';
import ReactSVG from 'react-svg';

import video from '../../assets/270 Video Camera.svg';

export default class ScheduleItem extends React.Component {
	render() {
		const scheduleEntry = this.props.scheduleEntry;
		const itemClass = (scheduleEntry.state === 'past') ? 'ghosted' : '';
		const videoButtonClass = (scheduleEntry.state === 'present') ? 'active' : '';

		const handleTelevisitClicked = () => {
			if(scheduleEntry.state === 'present') {
				const relatedPatientId = this.props.scheduleEntry.relatedPatientId;
				this.props.launchTelevisitFunction(relatedPatientId, this.props.scheduleEntry.title);
			}
		}

		return (
			<li className={itemClass}>
				<div className="scheduleItem">
					<ul>
						<li>{this.props.scheduleEntry.timeframe}</li>
						<li>{this.props.scheduleEntry.title}</li>
						<li>{this.props.scheduleEntry.attendees}</li>
						<li>{this.props.scheduleEntry.study}</li>
					</ul>
					<button className={videoButtonClass} onClick={handleTelevisitClicked}><ReactSVG path={video} className='video' /></button>
				</div>
			</li>
		);
	}
}