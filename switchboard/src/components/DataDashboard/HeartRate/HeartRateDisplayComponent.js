import React from 'react';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import moment from 'moment';

import HeartRateBadge from './HeartRateBadge';

export default class HeartRateDisplayComponent extends React.Component {
	render() {
		const width = 600;
		const height = 200;
		const margin = { top: 5, right: 30, left: 20, bottom: 5 };
		const lineColor = "green";

		const heartRateEventData = this.props.heartRateEventData;

		const toShortFormat = (value) => {			
            return moment(value, "MM/DD HH:mm:ss").format("DD-MMM");
		};

		return (
			<div>
				<div>
					Heart Rate over Time
					<HeartRateBadge mostRecentReading={this.props.mostRecentReading} />
				</div>
				<LineChart width={width} height={height} data={heartRateEventData} margin={margin}>
					<XAxis dataKey="datetime" tickFormatter={toShortFormat} />
					<YAxis domain={['dataMin-1', 'dataMax+1']} />
					<Tooltip />
					<Line dataKey="heartrate" stroke={lineColor} />
				</LineChart>
			</div>
		);
	}
}