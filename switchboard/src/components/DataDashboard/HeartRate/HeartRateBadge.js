import React from 'react';
import moment from 'moment'

export default class HeartRateBadge extends React.Component {
	constructor() {
		super();

		this.lastKnownEvent = null;

		this.state = {
			pulse: null
		};
	}

	componentDidMount() {
		const self = this;
		this.interval = setInterval(() => {
			if (self.lastKnownEvent) {
				var lastKnownEventDateTime = new Date(self.lastKnownEvent.datetimeasval);
				if(!self.hasRecentHeartbeat(lastKnownEventDateTime)) {
					self.setState({ pulse: Date.now() })
				}
			}
		}, 10000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	hasRecentHeartbeat(heartRateDateTime) {
		return moment(heartRateDateTime).isAfter(moment().add(-5, 'minute'));
	}

	render() {
		const lastHeartRateEvent = this.props.mostRecentReading;
		if(!lastHeartRateEvent) {
			return null;
		}

		this.lastKnownEvent = lastHeartRateEvent;

		const heartRateValue = lastHeartRateEvent.heartrate;
		const heartRateDateTime = new Date(lastHeartRateEvent.datetimeasval);
		const heartRateDate = moment(heartRateDateTime).format("DD-MMM");
		const heartRateTime = moment(heartRateDateTime).format("HH:mm:ss");

		const heartClass = "heart" + (this.hasRecentHeartbeat(heartRateDateTime) ? " heartbeat" : "");

		return (
			<div className="HeartRateBadge">
				<div className={heartClass}>
					<div className="heartrate">{heartRateValue}</div>
				</div>
				<div className="date">
					<div>{heartRateDate}</div>
					<div>{heartRateTime}</div>
				</div>
			</div>
		);
	}
}