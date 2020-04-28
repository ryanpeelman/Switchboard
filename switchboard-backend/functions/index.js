const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var app = express();
var router = express.Router();

// Automatically allow cross-origin requests
router.use(cors({ origin: true }));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//clear all data for a specified user
//USAGE: POST to https://us-central1-devicedatamirror.cloudfunctions.net/api/clearevents
//       set payload equal to { "userid":"<my firebase user id>" }
router.post('/clearevents', (req, res) => {
    var userid = req.body.userid;
    var removeCount = 0;
    const eventsReference = admin.database().ref('events');

    eventsReference.orderByChild('userid').equalTo(userid)
        .once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                eventsReference.child(childSnapshot.key).remove();
                removeCount++;
            });

            res.send(removeCount + ' objects removed');
        });
});

// a middleware to validate event entries
router.use('/events', (req, res, next) => {
    const eventValidator = require('./EventValidator');
    const notifier = require('./Notifier')(admin.database());
    
    var event = req.body;
    if(!eventValidator.isEventValid(event)) {
        const patientGuideId = "ahnFuBrWmeb0Tfa3PME3xzYj8pS2";
        notifier.sendValidationFailureNotification(patientGuideId, event);
    }

    next();
});

//post an event entry
//USAGE: https://us-central1-devicedatamirror.cloudfunctions.net/api/events
router.post('/events', (req, res, next) => {
    var event = req.body;

    const eventsReference = admin.database().ref('events');
    eventsReference.push(event);

    res.end();
});

//post a notification
//USAGE: https://us-central1-devicedatamirror.cloudfunctions.net/api/notifications 
//EXAMPLE PAYLOAD: 
/*
{ 
    "userId": "QaQ8sVmN49TqKswmmhGco4WqSer1", 
    "notification": {"uid": "QaQ8sVmN49TqKswmmhGco4WqSer1", "name": "Test Notification", "duedate": "04/May/2018", "isOpen": "false" }
}
*/
router.post('/notifications', (req, res, next) => {
    var userId = req.body.userId; 
    var notification = req.body.notification;    

    const notificationsReference = admin.database().ref('notifications/' + userId);
    notificationsReference.push(notification);

    res.end();
});

//query all data for a specified user
//USAGE: https://us-central1-devicedatamirror.cloudfunctions.net/api/userevents/123
//       where '123' is the id of the requested user
router.get('/userevents/:userId', (req, res) => {
    const userId = req.params.userId;
    const eventsReference = admin.database().ref('events');
    const query = eventsReference.orderByChild('userid').equalTo(userId);
    query.once('value', (snapshot) => {
        let events = snapshot.val();
        res.send(JSON.stringify(events));
    });
});

//post a spirograph entry
//(this isn't really necessary because spiro measurements are sent to the events database, but keep this endpoint here for debugging purposes)
//usage: https://us-central1-devicedatamirror.cloudfunctions.net/api/spiro
router.post('/spiro', (req, res, next) => {
    var spiroEntry = req.body;

    const spiroReference = admin.database().ref('events');
    spiroReference.push(spiroEntry);

    res.end();
});

// mount the router on the app
app.use('/', router);

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
