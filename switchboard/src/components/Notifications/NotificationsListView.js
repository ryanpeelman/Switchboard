import React from 'react';
import moment from 'moment';

import NotificationsItem from './NotificationsItem';

export default class NotificationsListView extends React.Component {

	render() {
		if (!this.props.notifications || (this.props.notifications.length === 0)) {
			return (
				<div className="NotificationsList">
					<div className="noNotifications"><p>No Notifications</p></div>
				</div>
			);
		}

		if (this.props.isPatientGuide) {
			const notificationItems = this.props.notifications.map((notification, index) =>
				<NotificationsItem
					key={`item-${index}`}
					notification={notification}
					currentUser={this.props.currentUser}
					handleClick={this.props.handleClick}
					handleClose={this.props.handleClose}
					isPatientGuide={this.props.isPatientGuide} />
			);

			return (
				<div className="NotificationsList">
					<ul className="notificationItems">{notificationItems}</ul>
				</div>
			);
		}

		const buildNotificationItems = (notifications) => notifications.map((notification, index) =>
			<NotificationsItem
				key={`item-${index}`}
				notification={notification}
				currentUser={this.props.currentUser}
				handleClick={this.props.handleClick}
				handleClose={this.props.handleClose}
				isPatientGuide={this.props.isPatientGuide} />
		);

		const items = [
			{ header: "Today", notifications: buildNotificationItems(this.props.notifications.filter(x => moment(x.datetime).isSame(moment(), 'day'))) }, 
			{ header: "Yesterday", notifications: buildNotificationItems(this.props.notifications.filter(x => moment(x.datetime).isSame(moment().subtract(1, 'day'), 'day'))) }
		];
		const notificationListItems = items.map((item, index) =>
			<div>
				<div className="notificationDayHeader">{item.header}</div>
				<ul className="notificationItems">{item.notifications}</ul>
			</div>
		);

		return (
			<div className="NotificationsList">
				{notificationListItems}
			</div>
		);
	}
}