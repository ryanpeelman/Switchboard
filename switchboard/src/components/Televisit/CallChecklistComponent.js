import React from 'react';
import ReactSVG from 'react-svg';

import downArrow from '../../assets/050 Chevron Down.svg';
import rightArrow from '../../assets/052 Chevron Right.svg';


export default class CallChecklistComponent extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			checklistEntries: this.props.checklistEntries,
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
		const entries = this.state.checklistEntries;
		if (!entries) {
			return null;
		}

		const entryDivs = entries.map((entry, index) =>
				<li key={`item-${index}`} className="task">
					<div>{entry.task}</div>
				</li>
		);

		return (
			<div className="CallChecklistComponent">
				<div className="header" onClick={this.toggleContent}>
					<div>
						{this.state.isComponentExpanded && <ReactSVG path={downArrow} className='downArrow' />}
						{!this.state.isComponentExpanded && <ReactSVG path={rightArrow} className='rightArrow' />}
					</div>
					<div className="headerText">Checklist</div>
				</div>
				{
					this.state.isComponentExpanded &&
					<div className="main">
						<ol className="entry">
							{entryDivs}
						</ol>
					</div>
				}
			</div>
		);
	}
}