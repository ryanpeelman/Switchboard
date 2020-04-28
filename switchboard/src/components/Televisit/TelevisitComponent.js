import React from 'react';
import ReactSVG from 'react-svg';

import collapse from '../../assets/066 Scale Down.svg';
import expand from '../../assets/091 Expand.svg';
import maximize from '../../assets/218 Square Outline.svg';
import minimize from '../../assets/166 Remove Minimize.svg';

import VideoComponent from './VideoComponent';
import VideoComponentGuide from './VideoComponentGuide';

export default class TelevisitComponent extends React.Component {
	constructor() {
		super();

		this.state = {
			minimized: false, 
			title: "Video Chat"
		}

		this.collapseVideoComponent = this.collapseVideoComponent.bind(this);
		this.expandVideoComponent = this.expandVideoComponent.bind(this);
		this.setTitle = this.setTitle.bind(this);
		this.toggleFullScreen = this.toggleFullScreen.bind(this);
		this.toggleMinimize = this.toggleMinimize.bind(this);
		this.setMinimized = this.setMinimized.bind(this);
	}

	collapseVideoComponent() {
		if (this.props.collapse) {
			this.props.collapse();
		}
	}

	expandVideoComponent() {
		if (this.props.expand) {
			this.props.expand();
		}
	}

	setTitle(title) {
		if(title === "") {
			title = "Video Chat";
		}

		this.setState({ title: title });
	}

	toggleFullScreen() {
		const isTelevisitFullScreen = !this.props.isTelevisitFullScreen;
		if (this.props.setTelevisitFullScreen) {
			this.props.setTelevisitFullScreen(isTelevisitFullScreen);
		}
	}

	toggleMinimize() {
		this.setState({ minimized: !this.state.minimized });
	}

	setMinimized(min) {
		this.setState({ minimized: min});
	}

	render() {
		const user = this.props.user;
		const isExpanded = this.props.isExpanded;
		const isTelevisitActive = this.props.isTelevisitActive;
		const isTelevisitFullScreen = this.props.isTelevisitFullScreen;
		const drilldownPatient = this.props.drilldownPatient;
		const setTelevisitActiveState = this.props.setTelevisitActiveState;

		const viewClass = "TelevisitComponent" + (this.state.minimized ? " minimized" : "");

		return (
			<div className={viewClass}>
				<div className="title">
					{
						isExpanded && 
						<p>{this.state.title}</p>
					}
					{
						!isTelevisitActive && user.isPatientGuide && 
						<div className="bLink" onClick={() => this.toggleMinimize()}>
							<ReactSVG path={this.state.minimized ? maximize : minimize} className='icon windowState' />
						</div>
					}
					{
						isTelevisitActive &&
						<div className="bLink" onClick={() => this.toggleFullScreen()}>
							<ReactSVG path={isTelevisitFullScreen ? collapse : expand} className='icon' />
						</div>
					}
				</div>
				{
					!user.isPatientGuide &&
					<VideoComponent
						currentUser={user}
						isExpanded={isExpanded}
						collapseVideoComponent={this.collapseVideoComponent}
						expandVideoComponent={this.expandVideoComponent}
						isTelevisitFullScreen = {isTelevisitFullScreen}
						setTelevisitActiveState={setTelevisitActiveState}
						setTitle={this.setTitle}
						setShowPopOutTab={this.props.setShowPopOutTab} />
				}
				{
					user.isPatientGuide &&
					<div className="content">
						<VideoComponentGuide
							currentUser={user}
//							isExpanded={isExpanded}
							collapseVideoComponent={this.collapseVideoComponent}
							expandVideoComponent={this.expandVideoComponent}
							isTelevisitFullScreen = {isTelevisitFullScreen}
							setTelevisitFullScreen = {this.props.setTelevisitFullScreen}
							setMinimized = {this.setMinimized}
							drilldownPatient={drilldownPatient}
							setSketchySubcomponentTelevisitHook={this.props.setSketchySubcomponentTelevisitHook}
							setTelevisitActiveState={setTelevisitActiveState}
							setTitle={this.setTitle} 
							minimized={this.state.minimized} />
					</div>
				}
			</div>
		);
	}
}