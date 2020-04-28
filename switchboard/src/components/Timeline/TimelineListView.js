import React from 'react';
import ReactSVG from 'react-svg';

import kit from '../../assets/123 Dolly.svg';
import milestone from '../../assets/262 Person Check.svg';
import visit from '../../assets/223 Stethoscope.svg';

export default class TimelineListView extends React.Component {
	renderNameCell(value) {
		return <div className="bLink">{value}</div>;
	}

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
		const timelineEvents = this.props.timelineEvents;
		const timelineEventRows = timelineEvents.map((timelineEvent, index) =>
			<div key={`item-${index}`} className="row">
				{this.renderIconCell(timelineEvent)}
				{this.renderNameCell(timelineEvent.name)}
				<div>{timelineEvent.type}</div>
				<div>{timelineEvent.status}</div>
				<div>{timelineEvent.date}</div>
			</div>
		);

		return (
			<div className="List">
				<div className="container">
					<div key={`item-header`} className="row header">
						<div></div>
						<div>Name</div>
						<div>Type</div>
						<div>Status</div>
						<div>Status Date</div>
					</div>
					{timelineEventRows}
				</div>
			</div>
		);
	}
}