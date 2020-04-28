import React from 'react';
import { toast } from 'react-toastify';

export default class PopupService {
	showError(message, title) {
		this.showToast(toast.TYPE.ERROR, message, title);
	}

	showNotification(message, title, onNotificationClicked) {
		this.showToast(toast.TYPE.INFO, message, title, onNotificationClicked);
	}

	showSuccess(message, title) {
		this.showToast(toast.TYPE.SUCCESS, message, title);
	}

	showToast(type, message, title, onNotificationClicked) {
		const ToastComponent = ({ closeToast }) => (
			<div className="ToastComponent" onClick={onNotificationClicked}>
				{title && <p className="title">{title}</p>}
				<p className="message">{message}</p>
			</div>
		);

		toast(<ToastComponent />, {type: type});
	}
}
