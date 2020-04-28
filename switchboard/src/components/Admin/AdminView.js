import React from 'react';

import MissionControlComponent from './MissionControlComponent';

export default class AdminView extends React.Component {
	render() {
		if (!this.props.currentUser) {
			return null;
		}

		return (
			<div className="AdminView">
				<MissionControlComponent />
			</div>
		);
	}
}