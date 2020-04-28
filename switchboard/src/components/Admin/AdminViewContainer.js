import React from 'react';

import AdminView from './AdminView';
import NavigationComponent from '../Navigation/NavigationComponent';

export default class AdminViewContainer extends React.Component {
	render() {
		if (!this.props.currentUser) {
			return null;
		}

		return (
			<div className="AdminViewContainer">
				<NavigationComponent currentUser={this.props.currentUser} onSignOut={this.props.onSignOut} />
				<AdminView currentUser={this.props.currentUser} />
			</div>
		);
	}
}