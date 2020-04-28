import React from 'react';
import ReactSVG from 'react-svg';
import moment from 'moment';

import downArrow from '../../../assets/050 Chevron Down.svg';
import rightArrow from '../../../assets/052 Chevron Right.svg';

import HeartRateDisplayComponent from './HeartRateDisplayComponent';

export default class HeartRateContainerComponent extends React.Component {
	constructor() {
		super();

		this.state = {
			isComponentExpanded: true
		}

		this.toggleContent = this.toggleContent.bind(this);
	}

	toggleContent() {
		this.setState({ isComponentExpanded: !this.state.isComponentExpanded });
	}

	render() {
		var sorted = this.props.eventData.sort(function (a, b) {
			return a.datetimeasval - b.datetimeasval;
		});

		const heartRateEventData = sorted.reverse().slice(0, 5).reverse();

		const mostRecentReading = heartRateEventData[heartRateEventData.length-1];
		const mostRecentReadingValue = mostRecentReading ? mostRecentReading.heartrate + " bpm  -  " + moment(mostRecentReading.datetimeasval).fromNow() : "";
		const mostRecentReadingDateTime = mostRecentReading ? moment(mostRecentReading.datetimeasval).format("DD-MMM-YYYY hh:mm A") : "";

		return (
			<div className="HeartRateContainerComponent">
				<div className="header" onClick={this.toggleContent}>
					<div>
						{this.state.isComponentExpanded && <ReactSVG path={downArrow} className='downArrow' />}
						{!this.state.isComponentExpanded && <ReactSVG path={rightArrow} className='rightArrow' />}
						HEART RATE
					</div>
					{mostRecentReading && <div>{mostRecentReadingValue}</div>}
					{mostRecentReading && <div>{mostRecentReadingDateTime}</div>}
				</div>
				{
					this.state.isComponentExpanded &&
					<div className="chartsContainer">
						<HeartRateDisplayComponent heartRateEventData={heartRateEventData} mostRecentReading={mostRecentReading} />
					</div>
				}
			</div>
		);
	}
}