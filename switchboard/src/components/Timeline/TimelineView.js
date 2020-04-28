import React from 'react';

import TimelineEventItem from './TimelineEventItem';

export default class TimelineView extends React.Component {
	render() {
		if (!this.props.timelineEvents) {
			return (<div><p>No Timeline Events!</p></div>);
		}

		const timelineEvents = this.props.timelineEvents;
		const timelineEventItems = timelineEvents.map((timelineEvent, index) =>
			<TimelineEventItem key={`item-${index}`} timelineEvent={timelineEvent} />
		);
		return (
			<ul>{timelineEventItems}</ul>
		);
	}
}