import React from 'react';
import ReactSVG from 'react-svg';

import downIcon from '../../assets/050 Chevron Down.svg';
import kit from '../../assets/123 Dolly.svg';
import milestone from '../../assets/262 Person Check.svg';
import visit from '../../assets/223 Stethoscope.svg';


export default class TimelineEventItem extends React.Component {
	renderIconCell(timelineEvent) {
		var icon = milestone;
		if (timelineEvent.type === "Kit") {
			icon = kit;
		}
		else if (timelineEvent.type === "Visit") {
			icon = visit;
		}
		
		var color = "grey";
		if (timelineEvent.completed) {
			color = "green";
		}
		else if (timelineEvent.date !== "TBD") {
			color = "blue";
		}

		return <div className={"iconContainer " + color}><ReactSVG path={icon} className="icon" /></div>;
	}

	render() {
		const completed = this.props.timelineEvent.completed;
		const itemClass = "TimelineEventItem" + (completed ? ' active' : '');

		const eventDateText = (this.props.timelineEvent.date === "TBD") ? "To Be Scheduled" : this.props.timelineEvent.date;
		const dateText = (this.props.timelineEvent.completed ? "Completed | " : "") + eventDateText;

		return (
			<li className={itemClass}>
				<div className="eventText">
					<div className="firstLine">
						<span>{this.props.timelineEvent.name}</span>
						<div className="downIconDiv">
							<ReactSVG path={downIcon} />
						</div>
					</div>
					<span>{dateText}</span>
				</div>

				{this.renderIconCell(this.props.timelineEvent)}
			</li>
		);
	}
}
