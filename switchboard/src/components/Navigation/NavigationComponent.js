import React from 'react';

import ApplicationTitleComponent from './ApplicationTitleComponent';
import CalendarLauncherComponent from './CalendarLauncherComponent';
import PageNavigatorComponent from './PageNavigator/PageNavigatorComponent';
import NotificationsComponent from '../Notifications/NotificationsComponent';
import WelcomeComponent from './WelcomeComponent';

export default class NavigationComponent extends React.Component {
	render() {
        let user = this.props.currentUser;
		if (!user) {
			return null;
		}

		return (
			<div className="NavigationComponent">
				<div className="NavLeft">
					<ApplicationTitleComponent />
					<PageNavigatorComponent user={user} />
				</div>
				<div className="NavRight">
					<CalendarLauncherComponent />
					<NotificationsComponent
						currentUser={user}
						isPatientGuide={false} />
					<WelcomeComponent 
						currentUser={user}
						onSignOut={this.props.onSignOut} />
				</div>
			</div>
		);
	}
}