import React from 'react';
import ReactSVG from 'react-svg';

import leftArrow from '../../assets/051 Chevron Left.svg';
import rightArrow from '../../assets/052 Chevron Right.svg';
import filterImg from '../../assets/filter.png';

import TimelineView from './TimelineView';
import TimelineListView from './TimelineListView';

export default class TimelineComponent extends React.Component {
	constructor() {
		super();

		this.state = {
			isTimelineVisible: true
		}

		this.toggleView = this.toggleView.bind(this);
	}

	getToggleClass(type) {
		return ((this.state.isTimelineVisible && type === "Timeline") || (!this.state.isTimelineVisible && type !== "Timeline")) ? "viewButton selected" : "viewButton";
	}

	toggleView() {
		this.setState({ isTimelineVisible: !this.state.isTimelineVisible });
	}

	render() {
		const timelineEvents = this.props.timelineEvents;

		return (
			<div className="TimelineComponent">
				<div className="title">
					<div className="titleText">
						<p>My Study Timeline</p>
					</div>
					<div className="TimelineViewToggle">
						<div>
							<button className={this.getToggleClass("Timeline")} onClick={this.toggleView}>Timeline</button>
							<button className={this.getToggleClass("List")} onClick={this.toggleView}>List</button>
						</div>
					</div>
					<div className="filter">
						<div className="filterButton">
							<img src={filterImg} className="filterImg" alt="" />
							<div className="filterText">Filter</div>
						</div>
					</div>
				</div>
				{
					this.state.isTimelineVisible &&
					<div className="Timeline">
						<button className="leftArrow"><ReactSVG path={leftArrow} /></button>
						<TimelineView timelineEvents={timelineEvents} />
						<button className="rightArrow"><ReactSVG path={rightArrow} /></button>
					</div>
				}
				{
					!this.state.isTimelineVisible &&
					<TimelineListView timelineEvents={timelineEvents} />
				}
			</div>
		);
	}
}
