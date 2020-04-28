import firebase from './firebase';
import PopupService from './PopupService';


export default class NotificationsBroker {
    constructor() {
        this.popupService = new PopupService();

        this.showNotification = this.showNotification.bind(this);
    }

    close(user) {
        firebase.database().ref('notifications/' + user.uid).off();
    }

    manageNotifications(user, notificationsUpdatedCallback, notificationHandlers) {
        const notificationsReference = firebase.database().ref('notifications/' + user.uid);

        //when notification value changes (i.e. user acknowledges a notification), issue owner-provided callback
        notificationsReference.orderByChild('acknowledged').equalTo(false)
            .on('value', (snapshot) => {
                let notifications = snapshot.val();

                //convert JSON list to js array, which is what the caller expects
                var notArray = [];

                for (var i in notifications) {
                    notifications[i].key = i;
                    notArray.push(notifications[i]);
                }

                notificationsUpdatedCallback(notArray);
            });

        //when notification values are added, display popup (will also issue owner-provided callback above)
        //first do some extra finagling so that we ignore the notification entries that are presently in the database at startup
        notificationsReference.once('value', (snapshot) => {

            //count the number of existing entries
            var ignoreCount = snapshot.numChildren();

            //handle notification added events
            notificationsReference.on('child_added', (snapshot, prevChildKey) => {
                //child_added fires once for each item already in the database; ignore these
                if (0 < ignoreCount) {
                    ignoreCount--;
                    return;
                }

                //handle new notification
                this.showNotification(snapshot.val(), notificationHandlers);
            });
        });
    }

    acknowledge(user, notification) {
        firebase.database().ref('notifications/' + user.uid + '/' + notification.key)
            .update({ acknowledged: true });
    }

    acknowledgeAll(user) {
        const notificationsRef = firebase.database().ref('notifications/' + user.uid);

        notificationsRef.once('value', (snapshot) => {
            snapshot.forEach((notification) => {
                notificationsRef.child(notification.key).update({ acknowledged: true });
            })
        });
    }

    createNotification(userId, data) {
        if (data.type === "TelevisitFollowUp") {
            const notificationsRef = firebase.database().ref('notifications/' + userId);
            notificationsRef.push({
                acknowledged: false,
                datetime: Date.now(),
                message: data.message,
                type: data.type
            });
        }
        //TODO: support other types
    }

    showNotification(notification, notificationHandlers) {
        const handler = notificationHandlers[notification.type];
        this.popupService.showNotification(notification.message, null, handler);
    }
}