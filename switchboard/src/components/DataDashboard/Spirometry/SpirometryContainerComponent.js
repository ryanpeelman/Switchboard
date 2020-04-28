import React from 'react';
import ReactSVG from 'react-svg';
import { Label, Legend, Line, LineChart, ReferenceArea, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import moment from 'moment';

import downArrow from '../../../assets/050 Chevron Down.svg';
import rightArrow from '../../../assets/052 Chevron Right.svg';

export default class SpirometryContainerComponent extends React.Component {
	constructor() {
		super();

		this.state = {
			isComponentExpanded: true
		}

		this.toggleContent = this.toggleContent.bind(this);
	}

	flattenDataToOneDataPointPerDay(data) {
		var sorted = data.sort(function (a, b) {
			return a.datetimeasval - b.datetimeasval;
		});

		var spirometryEventData = [];
		sorted.forEach(event => {
			var matchingDateIndex = spirometryEventData.findIndex(x => x && x.datetime === event.datetime);
			if (matchingDateIndex >= 0) {
				spirometryEventData[matchingDateIndex] = event;
			}
			else {
				spirometryEventData.push(event);
			}
		});

		return spirometryEventData;
	}

	getMonths(data) {
		var months = [];
		data.forEach(event => {
			var month = moment(event.eventDateTime).format("MMMM");
			if (!months.includes(month)) {
				months.push(month);
			}
		});

		return months;
	}

	toggleContent() {
		this.setState({ isComponentExpanded: !this.state.isComponentExpanded });
	}

	render() {
		const width = 600;
		const height = 200;
		const margin = { top: 5, right: 30, left: 20, bottom: 5 };
		const darkGray = "#999";
		const lightGray = "#f2f2f2";
		const lightBlue = "#297dfd";

		const spirometryEventData = this.flattenDataToOneDataPointPerDay(this.props.eventData);
		const months = this.getMonths(spirometryEventData);

		const monthLabel = months.join(" | ");
		const xAxisTickFormatter = (tickItem) => { return new Date(tickItem).getDate(); }
		const yAxisTicks = [0, .2, .4, .6, .8, 1];
		const legendItems = [{ value: 'FEV1/FVC Ratio' }, { value: 'Normal' }];

		const mostRecentReading = spirometryEventData[spirometryEventData.length-1];
		const mostRecentReadingValue = mostRecentReading ? parseFloat(mostRecentReading.ratio).toFixed(2) + " (FEV1/FVC)  -  " + moment(mostRecentReading.eventDateTime).fromNow() : "";
		const mostRecentReadingDateTime = mostRecentReading ? moment(mostRecentReading.eventDateTime).format("DD-MMM-YYYY hh:mm A") : "";

		return (
			<div className="SpirometryContainerComponent">
				<div className="header" onClick={this.toggleContent}>
					<div>
						{this.state.isComponentExpanded && <ReactSVG path={downArrow} className='downArrow' />}
						{!this.state.isComponentExpanded && <ReactSVG path={rightArrow} className='rightArrow' />}
						SPIROMETER
					</div>
					{mostRecentReading && <div>{mostRecentReadingValue}</div>}
					{mostRecentReading && <div>{mostRecentReadingDateTime}</div>}
				</div>
				{
					this.state.isComponentExpanded &&
					<div className="chartContainer">
						<LineChart width={width} height={height} data={spirometryEventData} margin={margin}>
							<ReferenceLine y="0" stroke={lightGray} />
							<ReferenceLine y=".2" stroke={lightGray} />
							<ReferenceLine y=".4" stroke={lightGray} />
							<ReferenceLine y=".6" stroke={lightGray} />
							<ReferenceLine y=".8" stroke={lightGray} />
							<ReferenceLine y="1" stroke={lightGray} />
							<XAxis dataKey="datetime" tickFormatter={xAxisTickFormatter} axisLine={false} tickLine={false}>
								<Label value={monthLabel} offset={0} position="insideBottom" stroke={darkGray} />
							</XAxis>
							<YAxis domain={[0, 1]} ticks={yAxisTicks} axisLine={false} tickLine={false} />
							<Tooltip content={<SpirometryChartTooltipComponent />} />
							<Line name="FEV1/FVC Ratio" dataKey="ratio" dot={false} activeDot={true} stroke={lightBlue} />
							<ReferenceArea name="Normal" y1={0.75} y2={0.9} stroke={darkGray} strokeOpacity={0.3} />
							<Legend verticalAlign="top" align="left" iconType="circle" payload={legendItems} />
						</LineChart>
					</div>
				}
			</div>
		);
	}
}

class SpirometryChartTooltipComponent extends React.Component {
	render() {
		const { active } = this.props;

		if (active) {
			const width = 250;
			const height = 100;
			const darkGray = "#999";
			const lightGray = "#f2f2f2";
			const lightBlue = "#297dfd";

			const { payload } = this.props;
			if (!payload) {
				return null;
			}

			const data = payload[0].payload;
			return (
				<div className="tooltipContainer">
					<span className="fieldHeader">{data.datetime}</span>
					<div className="fieldData">
						<div>
							<span>FEV1</span>: {data.fev1}
						</div>
						<div>	
							<span>FVC</span>: {data.fvc}L
						</div>
							
					</div>
					<div className="chartContainer">
						<span>Flow(L/S)</span>
						<LineChart width={width} height={height} data={data.flow}>
							<ReferenceLine y="0" stroke={lightGray} />
							<ReferenceLine y="2" stroke={lightGray} />
							<ReferenceLine y="4" stroke={lightGray} />
							<ReferenceLine y="6" stroke={lightGray} />
							<ReferenceLine y="8" stroke={lightGray} />
							<XAxis dataKey="time" ticks={[0, 1, 2, 3, 4]} axisLine={false} tickLine={false}>
								<Label value="Time (seconds)" offset={0} position="insideBottom" stroke={darkGray} />
							</XAxis>
							<YAxis domain={[0, 8]} ticks={[4, 8]} axisLine={false} tickLine={false} />
							<Line name="Flow(L/S)" dataKey="volume" dot={false} activeDot={true} stroke={lightBlue} />
						</LineChart>
					</div>
					<div className="bLink">View Details</div>
				</div>
			);
		}

		return null;
	}
}