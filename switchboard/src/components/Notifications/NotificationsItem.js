import React from 'react';
import ReactSVG from 'react-svg';
import moment from 'moment';

import actionIcon from '../../assets/086 Edit.svg';
import defaultIcon from '../../assets/notification.svg';
import taskIcon from '../../assets/task.svg';
import televisitIcon from '../../assets/270 Video Camera.svg';

import POCHelperService from '../../services/POCHelperService';

export default class NotificationsItem extends React.Component {

	getAvatarElement(notification) {
		const avatarImageURL = POCHelperService.getAvatarImageURLFromNotification(notification);
		return <img src={avatarImageURL} className='avatar' alt={notification.title} />
	}

	getMessage(notification) {
		return (notification.message !== null) ? notification.message : ""
	}

	getTime(notification) {
		if (notification.datetime === null) {
			return "";
		}

		return (this.props.isPatientGuide) ? moment(notification.datetime).fromNow() : moment(notification.datetime).format("hh:mm A");
	}

	getTitle(notification) {
		if (notification.type === "Compliance") {
			return "Compliance";
		}
		else if (notification.type === "EventEntryAlert") {
			return "Alert";
		}
		else if (notification.type === "TaskReminder") {
			return "Reminder";
		}
		else if (notification.type === "TelevisitFollowUp") {
			return "Televisit";
		}
		else if (notification.type === "Action") {
			return "Action Required";
		}

		//else handle "other" or unknown types
		if (notification.title !== null) {
			return notification.title;
		}

		return "Other";
	}

	render() {
		const notification = this.props.notification;

		if (notification.acknowledged !== false) {
			return null;
		}

		var buttonHtml = null;

		if (notification.type === "Action") {
			buttonHtml = <button className="action"><ReactSVG path={actionIcon} /></button>;
		}
		else if (notification.type === "Message") {
			buttonHtml = <button className="message">{this.getAvatarElement(notification)}</button>;
		}
		else if (notification.type === "TaskReminder") {
			buttonHtml = <button className="task"><ReactSVG path={taskIcon} /></button>;
		}
		else if (notification.type === "TelevisitFollowUp") {
			buttonHtml = <button className="televisit"><ReactSVG path={televisitIcon} /></button>;
		}
		else {
			buttonHtml = <button className="default"><ReactSVG path={defaultIcon} /></button>;
		}

		if (this.props.isPatientGuide) {
			return (
				<li onClick={(e) => this.props.handleClick(e, notification)}>
					<div className="notificationsItem">
						{buttonHtml}
						<ul>
							<li>{this.getTitle(notification)}</li>
							<li>{this.getMessage(notification)}</li>
							<li>{this.getTime(notification)}</li>
						</ul>
					</div>
				</li>
			);
		}

		return (
			<li onClick={(e) => this.props.handleClick(e, notification)}>
				<div className="notificationsItem">
					{buttonHtml}
					<ul>
						<li>{this.getTitle(notification)}</li>
						<li>{this.getMessage(notification)}</li>
					</ul>
					<div className="right">
						<div className="datetime">{this.getTime(notification)}</div>
					</div>
				</div>
			</li >
		);
	}
}