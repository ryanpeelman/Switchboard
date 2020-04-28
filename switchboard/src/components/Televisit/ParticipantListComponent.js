import React from 'react';
import ReactSVG from 'react-svg';

import downArrow from '../../assets/050 Chevron Down.svg';
import rightArrow from '../../assets/052 Chevron Right.svg';


export default class ParticipantListComponent extends React.Component {

	constructor() {
		super();

		this.state = {
			isComponentExpanded: false,
			wasComponentExpanded: false			//when entering fullscreen, remember whether or not we were expanded
		}

		this.toggleContent = this.toggleContent.bind(this);
	}

	toggleContent() {
		this.setState({ isComponentExpanded: !this.state.isComponentExpanded });
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		//check if isTelevisitFullScreen property changes
		if (prevProps.isTelevisitFullScreen === this.props.isTelevisitFullScreen) {
			return;
		}

		//if televisit enters fullscreen, expand and remember current expand state
		if (this.props.isTelevisitFullScreen) {
			const isExpanded = this.state.isComponentExpanded;
			this.setState({ wasComponentExpanded: isExpanded, isComponentExpanded: true });
		}

		//otherwise televisit is leaving fullscreen; restore previous expand state
		else {
			this.setState({ isComponentExpanded: this.state.wasComponentExpanded });
		}
	}

	render() {
		const participants = this.props.participants;
		if (!participants) {
			return null;
		}

		const participantDivs = participants.map((participant, index) =>
		
			<div key={index} className="participant">
				<div className="patientID-pic">
					<div>
						<img src={participant.profileImageSmall} className='patientPic' alt={participant.displayName} />
					</div>
				</div>
				<div className="patientID-details">
					<div>
						<div className="displayName">
							{participant.displayName}
						</div>
						<div className="role">{participant.role}</div>
					</div>
				</div>
			</div>
		);

		return (
			<div className="ParticipantListComponent">
				<div className="header" onClick={this.toggleContent}>
					<div>
						{this.state.isComponentExpanded && <ReactSVG path={downArrow} className='downArrow' />}
						{!this.state.isComponentExpanded && <ReactSVG path={rightArrow} className='rightArrow' />}
					</div>
					<div className="headerText">Participants</div>
				</div>
				{
					this.state.isComponentExpanded &&
					<div className="main">
						{participantDivs}
					</div>
				}
			</div>
		);
	}
}
