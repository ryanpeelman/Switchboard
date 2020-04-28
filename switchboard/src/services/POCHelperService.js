import moment from 'moment';

export default class POCHelperService {
    /*** TYPES ***
    Event Data Type = heartrate, pillcompliance, spirometry 
    (EventDataMapper)
    
    Notification Type = Compliance, EventEntryAlert, TaskReminder, TelevisitFollowUp 
    (compliance-monitory/Notifier, NotificationsItem, VideoComponentGuide, NotificationsBroker, TelevisitService)

    Visit Type = home, televisit 
    (PatientVisitsComponent)
    *************/

    static createScheduleEntryForComplianceCheckIn(timeFrame) {
        return {
            timeframe: timeFrame,
            title: "Compliance Check-in",
            attendees: "Helen Jones",
            state: 'future',
            study: 'ALZVS369',
            relatedPatientId: 'c5I3ttr5ThNZGXRQjIhVYS7iAOH2'
        }
    }

    static createTelevisitNotification(patientGuideName) {
        return {
            type: "TelevisitFollowUp",
            message: "Time to join your televisit session with " + patientGuideName + ".  Click here or on the televisit tab on the left of the page to join."
        };        
    }

    static getApplicationPages(user) {
        if(user.isAdmin) {
            return [
                { name: "Home" }
            ]
        }

        return [
            { name: "Home" },
            { name: "Communication" },
            { name: "My Diary" },
            { name: "Payments" },
            { name: "Resources", hasDropdown: true }
        ];
    }

    static getAvatarImageURLFromNotification(notification) {
        return "https://sds-switchboard.azurewebsites.net/images/Tony_Murphy.jpg";
    }

    static getChecklistEntries() {
        return [
            { task: "Confirm televisit set up", completed: true },
            { task: "Explain heart rate monitor", completed: true },
            { task: "Explain spirometer", completed: true },
            { task: "Explain medication compliance tracker", completed: true },
            { task: "Test all devices and confirm connectivity", completed: true },
            { task: "Discuss timeline for next visit", completed: true }
        ];
    }

    static getKnownPatientNames() {
        return [
            "Martin Wilson",
            "Kyle Ortega",
            "Deborah Jansen",
            "Helen Jones",
            "Loretta Ritter",
            "Erica Higgins"
        ];
    }

    static getKnownPatientNameFromText(text) {
        const knownPatientNames = POCHelperService.getKnownPatientNames();
        const patientName = knownPatientNames.find(name => text.includes(name));
        return patientName;
    }

    static getPatientGuideRecord() {
        return {
            displayName: "Tony Murphy",
            isPatientGuide: true,
            uid: "ahnFuBrWmeb0Tfa3PME3xzYj8pS2",
            profileImage: "https://sds-switchboard.azurewebsites.net/images/Tony_Murphy.jpg",
            profileImageSmall: "https://sds-switchboard.azurewebsites.net/images/Tony_Murphy-sm.jpg",
            role: "Patient Guide"
        };
    }

    static getPatientSummaryData() {
        return {
            active: [
                { name: 'Pre-Screened', value: 4 },
                { name: 'Consented', value: 4 },
                { name: 'Screened', value: 3 },
                { name: 'Randomized', value: 4 }
            ],
            notActive: [
                { name: 'Completed', value: 9 },
                { name: 'Screen Failed', value: 5 },
                { name: 'Withdrew Consent', value: 4 },
                { name: 'Lost to Follow Up', value: 2 }
            ]
        };
    }

    static getStudyTeam() {
        return {
            primary: [
                { displayName: "Tony Murphy", role: "Patient Guide", profileImage: "https://sds-switchboard.azurewebsites.net/images/Tony_Murphy.jpg" },
                { displayName: "Max McCrae", role: "Primary Investigator", profileImage: "https://sds-switchboard.azurewebsites.net/images/Max_McCrae.jpg" }
            ],
            backup: [
                { displayName: "Maggie Holmes", role: "Patient Guide", profileImage: "https://sds-switchboard.azurewebsites.net/images/Maggie_Holmes.jpg" },
                { displayName: "Shayna Ballard", role: "Primary Investigator", profileImage: "https://sds-switchboard.azurewebsites.net/images/Shayna_Ballard.jpg" }
            ]
        };
    }

    static getTaskCategories() {
        return [
            "Safety Related",
            "Enrollment Related",
            "Schedule Visits",
            "Medical Records",
            "Action Items"
        ];
    }

    static sanitizeNotificationsToCurrentDates(notifications) {
        const NOTIFICATION_DATETIME_FORMAT = "DD-MMM-YYYY HH:mm:ss";
        const yesterday = moment().subtract(1, 'days').hours(10).minutes(28).format(NOTIFICATION_DATETIME_FORMAT);
        const today = moment().hours(15).minutes(23).format(NOTIFICATION_DATETIME_FORMAT);

        if (notifications) {
            notifications.forEach(notification => {
                if (notification.poc_datetimeid) {
                    if (notification.poc_datetimeid === "000") {
                        notification.datetime = yesterday;
                    }
                    else if (notification.poc_datetimeid === "001") {
                        notification.datetime = today;
                    }
                    else if (notification.poc_datetimeid === "002") {
                        notification.datetime = today;
                    }
                }
            });
        }

        return notifications;
    }

    static sanitizeTasksToCurrentDates(tasks) {
        const TASK_DATETIME_FORMAT = "DD-MMM-YYYY";
        const yesterday = moment().subtract(1, 'days').format(TASK_DATETIME_FORMAT);
        const today = moment().format(TASK_DATETIME_FORMAT);
        const tomorrow = moment().add(1, 'day').format(TASK_DATETIME_FORMAT);
        const threeDaysFromNow = moment().add(3, 'days').format(TASK_DATETIME_FORMAT);
        const nextWeek = moment().add(1, 'week').format(TASK_DATETIME_FORMAT);

        if (tasks) {
            tasks.forEach(task => {
                if (task.poc_duedateid) {
                    if (task.poc_duedateid === "000") {
                        task.duedate = yesterday;
                    }
                    else if (task.poc_duedateid === "001") {
                        task.duedate = today;
                    }
                    else if (task.poc_duedateid === "002") {
                        task.duedate = tomorrow;
                    }
                    else if (task.poc_duedateid === "003") {
                        task.duedate = threeDaysFromNow;
                    }
                    else {
                        task.duedate = nextWeek;
                    }
                }
            });
        }

        return tasks;
    }

    static updatePillCompliance(uid, date, meridiem) {
        const datetime = moment(date).startOf('day').add(meridiem === "AM" ? 0 : 12, 'hours').toDate();
        const event = {
            userid: uid,
            deviceid: "Manual",
            datetime: datetime,
            pilltaken: 1
        };

        fetch('https://us-central1-devicedatamirror.cloudfunctions.net/api/events', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ":  " + errorMessage);
        });
    }
}