import React from 'react';

export default class WelcomeComponent extends React.Component {
	render() {
		let user = this.props.currentUser;

		if (!user) {
			return null;
		}

		return (
			<div className="WelcomeComponent">
                {user.displayName}<div className="bLink" onClick={this.props.onSignOut}><img src={user.profileImageSmall} className='avatar' alt={user.displayName} /></div>
			</div>
		);
	}
}