import React from 'react';
import ReactSVG from 'react-svg';

import closeIcon from '../../assets/close.svg';
import notificationIcon from '../../assets/171 Notification.svg';
import notificationIconGuide from '../../assets/notification.svg';
import settingsIcon from '../../assets/170 Notification Settings.svg';

import NotificationsBroker from '../../services/NotificationsBroker';
import POCHelperService from '../../services/POCHelperService';
import ScheduleService from '../../services/ScheduleService';
import TelevisitService from '../../services/TelevisitService';

import NotificationsListView from './NotificationsListView';
import DateTimePickerComponent from './DateTimePickerComponent';

export default class NotificationsComponent extends React.Component {
	constructor() {
		super();

		this.notificationsBroker = new NotificationsBroker();
		this.scheduleService = ScheduleService.getInstance();
		this.televisitService = TelevisitService.getInstance();

		this.closeItem = this.closeItem.bind(this);
		this.closePanel = this.closePanel.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleDateTimePickerSave = this.handleDateTimePickerSave.bind(this);
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		this.handleComplianceNotificationClick = this.handleComplianceNotificationClick.bind(this);
		this.handleTelevisitNotificationClick = this.handleTelevisitNotificationClick.bind(this);
		this.togglePanel = this.togglePanel.bind(this);

		this.notifPanelNode = null;
		this.dtPickNode = null;

		this.state = {
			showPanel: false,
			showDateTimePicker: false,
			notifications: [],
			currentNotification: null
		}
	}

	componentDidMount() {
		const notificationsUpdatedCallback = (notifications) => {
			//sort notifications by date
			var sorted = notifications.sort((a, b) => {
				return b.datetime - a.datetime;
			});

			this.setState({ notifications: sorted });
		}

		const notificationHandlers = {
			TelevisitFollowUp: this.handleTelevisitNotificationClick
		}

		this.notificationsBroker.manageNotifications(this.props.currentUser, notificationsUpdatedCallback, notificationHandlers);
	}

	componentWillUnmount() {
		this.notificationsBroker.close(this.props.currentUser);
	}

	closeItem(notification) {
		this.notificationsBroker.acknowledge(this.props.currentUser, notification);
	}

	closePanel() {
		//handle the click by closing the notifications panel (and the date/time picker if open)
		this.togglePanel();
		this.setState({ showDateTimePicker: false });
	}

	handleClick(e, notification) {
		if ((e.target.className.baseVal && e.target.className.baseVal.includes("close")) ||
			(e.target.parentElement.className.baseVal && e.target.parentElement.className.baseVal.includes("close"))) {
			return;
		}

		if (notification.type === "Compliance") {
			this.handleComplianceNotificationClick(notification);
		}
		else if (notification.type === "EventEntryAlert") {
			if (notification && notification.relatedPatientId && this.props.launchDrilldown) {
				this.setState({ currentNotification: notification });

				this.props.launchDrilldown(notification.relatedPatientId);

				this.closeItem(notification);
				this.setState({ currentNotification: null });
			}
		}
		else if (notification.type === "TelevisitFollowUp") {
			this.handleTelevisitNotificationClick(notification);
		}
	}

	handleOutsideClick(e) {
		// ignore clicks on the component itself
		if (!this.notifPanelNode || this.notifPanelNode.contains(e.target)) {
			return;
		}

		// ignore clicks on the date/time picker
		if (this.dtPickNode && this.dtPickNode.contains(e.target)) {
			return;
		}

		//ignore clicks on the close buttons, the "mark all as read" button, and notification popovers
		//for each, test the target element and all of its parent elements
		//TODO: this feels like a hack
		if (e.target.className && (e.target.className !== undefined)) {
			const val = ((e.target.className.baseVal === null) || (e.target.className.baseVal === undefined)) ? e.target.className : e.target.className.baseVal;

			if (val.includes("closeNotificationItem") || val.includes("markAllNotificationItems") || val.includes("ToastComponent") || val.includes("Toastify__toast")) {
				return;
			}
		}

		if (e.target.parentElement && e.target.parentElement.className && (e.target.parentElement.className !== undefined)) {
			const val = ((e.target.parentElement.className.baseVal === null) || (e.target.parentElement.className.baseVal === undefined)) ? e.target.parentElement.className : e.target.parentElement.className.baseVal;

			if (val.includes("closeNotificationItem") || val.includes("markAllNotificationItems") || val.includes("ToastComponent") || val.includes("Toastify__toast")) {
				return;
			}
		}

		this.closePanel();
	}

	togglePanel() {
		//attach/remove event handler for clicking outside of panel
		if (!this.state.showPanel) {
			document.addEventListener('click', this.handleOutsideClick, false);
		}
		else {
			document.removeEventListener('click', this.handleOutsideClick, false);
		}

		//toggle panel visibility
		this.setState({ showPanel: !this.state.showPanel });
	}

	render() {
		const notifications = POCHelperService.sanitizeNotificationsToCurrentDates(this.state.notifications.filter(n => n.type !== "TelevisitFollowUp"));

		const notificationsCount = (notifications === null) ? 0 : notifications.length;
		const hasNotifications = 0 < notificationsCount;
		const countMarkerClassName = "countMarker" + (this.props.isPatientGuide ? " guide" : "");
		const notificationsPanelClassName = "NotificationsPanel" + (this.props.isPatientGuide ? " guide" : "");

		return (
			<div className="NotificationsComponent">
				<div className="NotificationsIcon" onClick={() => this.togglePanel()}>
					<button className="notificationButton">
						{!this.props.isPatientGuide && <ReactSVG path={notificationIcon} className="notificationIcon" />}
						{this.props.isPatientGuide && <ReactSVG path={notificationIconGuide} className="notificationIconGuide" />}
					</button>
					{(0 < notificationsCount) && <div className={countMarkerClassName}>{notificationsCount}</div>}
				</div>
				{
					this.state.showPanel &&
					<div className={notificationsPanelClassName} ref={node => { this.notifPanelNode = node }}>
						{
							this.props.isPatientGuide &&
							<div className="title">
								<p>Notifications</p>
								<div className="right">
									{
										hasNotifications &&
										<div onClick={() => this.notificationsBroker.acknowledgeAll(this.props.currentUser)} className="bLink markAllNotificationItems">
											Mark all as read
									</div>
									}
									<div onClick={this.closePanel}><ReactSVG path={closeIcon} className="close" /></div>
								</div>
							</div>
						}
						{
							!this.props.isPatientGuide && 
							<div onClick={this.closePanel} className="closeContainer"><ReactSVG path={closeIcon} className="close" /></div>
						}
						<NotificationsListView
							notifications={notifications}
							currentUser={this.props.currentUser}
							handleClick={this.handleClick}
							handleClose={this.closeItem} 
							isPatientGuide={this.props.isPatientGuide} />
						{
							!this.props.isPatientGuide &&
							<div className="notificationsFooter">
								{
									hasNotifications &&
									<div onClick={() => this.notificationsBroker.acknowledgeAll(this.props.currentUser)} className="bLink markAllNotificationItems">
										Dismiss All
									</div>
								}
								<ReactSVG path={settingsIcon} className="settingsIcon" />
							</div>
						}
					</div>
				}
				{
					this.state.showDateTimePicker &&
					<div className="DateTimePickerPanel" ref={node => { this.dtPickNode = node }} >
						<DateTimePickerComponent handleSave={this.handleDateTimePickerSave} />
					</div>
				}
			</div>
		);
	}

	handleComplianceNotificationClick(notification) {
		this.setState({ currentNotification: notification, showDateTimePicker: true });
	}

	handleDateTimePickerSave(moment) {
		//add the entry to schedule
		this.scheduleService.addComplianceScheduleEntry(moment);

		//acknowledge the associated notification
		//hide the date/time picker and then notification panel beneath it
		this.closeItem(this.state.currentNotification);
		this.setState({ currentNotification: null, showDateTimePicker: false });
		this.togglePanel();
	}

	handleTelevisitNotificationClick(notification) {
		//join the televisit session
		//TODO: this always joins the room associated with my user. It does not distinguish among multiple Patient Guides,
		//      since that concept does not currently exist
		const callback = (json) => {
			if (!json.error) {
				//acknowledge the notification
				this.closeItem(this.state.currentNotification);

				//hide the notification panel
				if (this.state.showPanel) {
					this.togglePanel();
				}
			}

			//remove callback since we're done handling this notification
			this.televisitService.removeJoinSessionCallback(callback);
		};

		this.setState({ currentNotification: notification });

		this.televisitService.addJoinSessionCallback(callback);
		this.televisitService.joinSession(this.props.currentUser.uid);
	}
}


