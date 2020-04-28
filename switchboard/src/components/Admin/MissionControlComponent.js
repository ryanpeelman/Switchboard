import React from 'react';
import moment from 'moment';

import EventDataMapper from '../DataDashboard/EventDataMapper';
import firebase from '../../services/firebase';
import PatientRepository from '../../services/PatientRepository';
import POCHelperService from '../../services/POCHelperService';

export default class MissionControlComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            patients: [],
            selectedPatient: null
        }

        this.getEventsByPatient = this.getEventsByPatient.bind(this);
        this.getEventsOfDataType = this.getEventsOfDataType.bind(this);
        this.getPatientRowClass = this.getPatientRowClass.bind(this);
        this.removeEventRecord = this.removeEventRecord.bind(this);
    }

    componentDidMount() {
        const onLoadCallback = (patients) => {
            this.setState({ patients: patients });
        }

        this.patientRepository = new PatientRepository(onLoadCallback);
    }

    generateATestHeartrateRecord(uid, min = 50, max = 85) {
        const minHeartRate = min;
        const maxHeartRate = max;
        const heartrate = this.generateRandomValue(minHeartRate, maxHeartRate);

        const event = {
            userid: uid,
            deviceid: "GenerateATestRecord",
            datetime: Date.now(),
            heartrate: heartrate
        };

        this.postEvent(event);
    }

    generateATestHeartrateRecordLastFiveDays(uid, startIndex = 0, min = 50, max = 85) {
        const minHeartRate = min;
        const maxHeartRate = max;

        var i;
        for (i = startIndex; i < 5; i++) {
            var heartrate = this.generateRandomValue(minHeartRate, maxHeartRate);
            var hour = this.generateRandomValue(0, 23);
            var minutes = this.generateRandomValue(0, 59);
            var datetime = moment().startOf('day').add((-1 * i), 'days').hour(hour).minute(minutes);

            var event = {
                userid: uid,
                deviceid: "GenerateATestRecord",
                datetime: parseInt(datetime.format("x"), 10),
                heartrate: heartrate
            };

            this.postEvent(event);
        }
    }

    generateATestHeartrateRecordPreviousFourDays(uid) {
        this.generateATestHeartrateRecordLastFiveDays(uid, 1)
    }

    generateATestSpirometryRecord(uid) {
        // const minFEV1 = 4.50;
        // const maxFEV1 = 5.50;
        // const fev1 = this.generateRandomValue(minFEV1, maxFEV1);

        // const ffev1 = parseFloat(fev1);
        // const maxFVC = 6.00;
        // const fvc = this.generateRandomValue(ffev1, maxFVC);

        // const event = {
        //     userid: uid,
        //     deviceid: "GenerateATestRecord",
        //     datetime: Date.now(),
        //     fev1: fev1,
        //     flow: this.getSampleFlowData(fvc),
        //     fvc: fvc
        // };

        // this.postEvent(event);

        const minFEV1 = 4.50;
        const maxFEV1 = 5.50;
        const maxFVC = 6.00;

        var fev1 = this.generateRandomDecimalValue(minFEV1, maxFEV1);
        var ffev1 = parseFloat(fev1);
        var fvc = this.generateRandomDecimalValue(ffev1, maxFVC);
        var hour = this.generateRandomValue(0, 23);
        var minutes = this.generateRandomValue(0, 59);
        var datetime = moment().startOf('day').hour(hour).minute(minutes);
        var event = {
            userid: uid,
            deviceid: "GenerateATestRecord",
            datetime: parseInt(datetime.format("x"), 10),
            fev1: fev1,
            flow: this.getSampleFlowData(fvc),
            fvc: fvc
        };

        this.postEvent(event);
    }

    generateATestSpirometryRecordLastFiveDays(uid, startIndex = 0) {
        const minFEV1 = 4.50;
        const maxFEV1 = 5.50;
        const maxFVC = 6.00;

        var i;
        for (i = startIndex; i < 5; i++) {
            var fev1 = this.generateRandomDecimalValue(minFEV1, maxFEV1);
            var ffev1 = parseFloat(fev1);
            var fvc = this.generateRandomDecimalValue(ffev1, maxFVC);
            var hour = this.generateRandomValue(0, 23);
            var minutes = this.generateRandomValue(0, 59);
            var datetime = moment().startOf('day').add((-1 * i), 'days').hour(hour).minute(minutes);
            var event = {
                userid: uid,
                deviceid: "GenerateATestRecord5",
                datetime: parseInt(datetime.format("x"), 10),
                fev1: fev1,
                flow: this.getSampleFlowData(fvc),
                fvc: fvc
            };

            this.postEvent(event);
        }
    }

    generateATestSpirometryRecordPreviousFourDays(uid) {
        this.generateATestSpirometryRecordLastFiveDays(uid, 1)
    }

    generateRandomValue(min, max) {
        return (Math.floor(Math.random() * (max - min + 1) + min)).toString();
    }

    generateRandomDecimalValue(min, max, places = 2) {
        return (Math.random() * (max - min + 1) + min).toFixed(2).toString();
    }

    getEventsByPatient(patientUid, callback) {
        const eventsReference = firebase.database().ref('events');
        const query = eventsReference.orderByChild('userid').equalTo(patientUid);
        query.once('value', (snapshot) => {
            let sourceEvents = snapshot.val();
            let events = EventDataMapper.getMappedDataFromSource(sourceEvents);
            callback(events);
        });
    }

    getEventsOfDataType(events, datatype) {
        var eventsOfDataType = [];
        if (datatype === "heartrate") {
            eventsOfDataType = events.filter(event => { return event.hasOwnProperty("heartrate") && event.heartrate });
        }
        else if (datatype === "pillcompliance") {
            eventsOfDataType = events.filter(event => { return event.hasOwnProperty("pilltaken") && event.pilltaken });
            eventsOfDataType.forEach(event => {
                event.datetimeasval = moment(event.datetimeasval).format("x");
            })
        }
        else if (datatype === "spirometry") {
            eventsOfDataType = events.filter(event => { return event.hasOwnProperty("flow") && event.flow });
        }

        return eventsOfDataType;
    }

    getPatientRowClass(patient) {
        return "patientRow " + ((this.state.selectedPatient && (this.state.selectedPatient.uid === patient.uid)) ? " selected" : "");
    }

    markCurrentAsMedicationCompliant(uid) {
        POCHelperService.updatePillCompliance(uid, moment(), moment().format("A"));
    }

    postEvent(event) {
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

    removeAllRecords(patientUid, datatype) {
        if (!patientUid) {
            return;
        }

        const callback = (events) => {
            var eventsOfDataType = this.getEventsOfDataType(events, datatype);
            eventsOfDataType.forEach(record => {
                this.removeEventRecord(record);
            });
        }

        this.getEventsByPatient(patientUid, callback);
    }

    removeEventRecord(record) {
        if (record.key) {
            const recordReference = firebase.database().ref('events/' + record.key);
            recordReference.remove();
        }
    }

    removeLatestRecord(patientUid, datatype) {
        if (!patientUid) {
            return;
        }

        const callback = (events) => {
            var eventsOfDataType = this.getEventsOfDataType(events, datatype);

            var sorted = eventsOfDataType.sort(function (a, b) {
                return a.datetimeasval - b.datetimeasval;
            });

            const lastRecord = sorted[sorted.length - 1];
            this.removeEventRecord(lastRecord);
        }

        this.getEventsByPatient(patientUid, callback);
    }

    sendComplianceNotificationToPatientGuide() {
        if (!this.state.selectedPatient) {
            return;
        }

        const complianceRule = "Spirometry (24 hrs)";
        const patientGuideId = "ahnFuBrWmeb0Tfa3PME3xzYj8pS2";
        const message = "Schedule compliance follow-up with " + this.state.selectedPatient.displayName + " - " + complianceRule;
        const notification = {
            userId: patientGuideId,
            notification: {
                type: "Compliance",
                message: message,
                datetime: Date.now(),
                acknowledged: false
            }
        }

        fetch('https://us-central1-devicedatamirror.cloudfunctions.net/api/notifications', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notification)
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ":  " + errorMessage);
        });
    }

    setSelectedPatient(patient) {
        this.setState({ selectedPatient: patient });
    }

    render() {
        const patientUid = (this.state.selectedPatient) ? this.state.selectedPatient.uid : null;

        const patientRows = this.state.patients.map((patient, index) =>
            <div key={`item-${index}`} className={this.getPatientRowClass(patient)} onClick={() => this.setSelectedPatient(patient)}>
                <img src={patient.profileImage} className='patientPic' alt={patient.displayName} />
                <div>{patient.displayName + (patient.isHidden ? " (No Data)" : "")}</div>
                <div>{patient.uid}</div>
            </div>
        );

        return (
            <div className="MissionControlComponent">
                <div className="title">Admin</div>
                <div className="content">
                    <div className="section">
                        <div className="sectionTitle">Patients</div>
                        <div className="patientRowsContainer">{patientRows}</div>
                    </div>
                    {
                        this.state.selectedPatient &&
                        <div className="section">
                            <div className="subsection">
                                <div className="subsectionTitle">Heartrate</div>
                                <div className="bLink" onClick={() => this.generateATestHeartrateRecord(patientUid)}>Simulate Normal Heartrate</div>
                                <div className="bLink" onClick={() => this.generateATestHeartrateRecord(patientUid, 86, 100)}>Simulate Abnormal Heartrate (High)</div>
                                <div className="bLink" onClick={() => this.generateATestHeartrateRecord(patientUid, 20, 49)}>Simulate Abnormal Heartrate (Low)</div>                                
                                <div className="bLink" onClick={() => this.generateATestHeartrateRecordPreviousFourDays(patientUid)}>Simulate Normal Heartrate (Previous 4 Days)</div>
                                <div className="bLink" onClick={() => this.generateATestHeartrateRecordLastFiveDays(patientUid)}>Simulate Normal Heartrate (Last 5 Days)</div>
                            </div>
                            <div className="subsection">
                                <div className="subsectionTitle">Spirometry</div>
                                <div className="bLink" onClick={() => this.generateATestSpirometryRecord(patientUid)}>Simulate Normal Spirometry</div>                                
                                <div className="bLink" onClick={() => this.generateATestSpirometryRecordPreviousFourDays(patientUid)}>Simulate Normal Spirometry (Previous 4 Days)</div>
                                <div className="bLink" onClick={() => this.generateATestSpirometryRecordLastFiveDays(patientUid)}>Simulate Normal Spirometry (Last 5 Days)</div>
                            </div>
                            <div className="subsection">
                                <div className="subsectionTitle">Medication Compliance</div>
                                <div className="bLink" onClick={() => this.markCurrentAsMedicationCompliant(patientUid)}>Mark Medication for Current Timeframe</div>
                            </div>
                        </div>
                    }
                    {
                        this.state.selectedPatient &&
                        <div className="section">
                            <div className="subsection">
                                <div className="subsectionTitle">Remove Records</div>
                                <div className="bLink" onClick={() => this.removeLatestRecord(patientUid, "heartrate")}>Remove Latest Heartrate Record (for selected patient)</div>
                                <div className="bLink" onClick={() => this.removeAllRecords(patientUid, "heartrate")}>Remove All Heartrate Records (for selected patient)</div>
                                <br />
                                <div className="bLink" onClick={() => this.removeLatestRecord(patientUid, "spirometry")}>Remove Latest Spirometry Record (for selected patient)</div>
                                <div className="bLink" onClick={() => this.removeAllRecords(patientUid, "spirometry")}>Remove All Spirometry Records (for selected patient)</div>
                                <br />
                                <div className="bLink" onClick={() => this.removeLatestRecord(patientUid, "pillcompliance")}>Remove Latest Medication Compliance Record (for selected patient)</div>
                                <div className="bLink" onClick={() => this.removeAllRecords(patientUid, "pillcompliance")}>Remove All Medication Compliance Records (for selected patient)</div>
                            </div>
                            <div className="subsection">
                                <div className="subsectionTitle">Notifications</div>
                                <div className="bLink" onClick={() => this.sendComplianceNotificationToPatientGuide()}>Send a Compliance Notification</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

    getSampleFlowData(fvc) {
        const numberOfPoints = 300;
        const finalTimeInSeconds = 4;
        const timeStep = finalTimeInSeconds/numberOfPoints;
        const kValue = 1.9;
        const maxVolume = fvc;

        const pointFunction = (time) => {
            return maxVolume*(1-Math.exp(-1*kValue*time));
        }

        var flow = [];
        for(var i = 0; i <= 4; i+=timeStep) {
            var point = {
                time: i, 
                volume: pointFunction(i)
            };
            flow.push(point);
        }

        return flow;
    }

    getSampleFlowDataOld() {
        return [
            { time: 2698, volume: 0.01 },
            { time: 77, volume: 0 },
            { time: 109, volume: -0.01 },
            { time: 144, volume: -0.02 },
            { time: 187, volume: -0.04 },
            { time: 243, volume: -0.06 },
            { time: 317, volume: -0.07 },
            { time: 427, volume: -0.09 },
            { time: 607, volume: -0.1 },
            { time: 901, volume: -0.12 },
            { time: 1396, volume: -0.09 },
            { time: 1429, volume: -0.07 },
            { time: 1455, volume: -0.06 },
            { time: 1473, volume: -0.04 },
            { time: 1488, volume: -0.03 },
            { time: 1502, volume: -0.02 },
            { time: 1517, volume: 0 },
            { time: 1533, volume: 0 },
            { time: 1549, volume: 0.01 },
            { time: 1566, volume: 0.03 },
            { time: 1583, volume: 0.04 },
            { time: 1599, volume: 0.05 },
            { time: 1614, volume: 0.07 },
            { time: 1629, volume: 0.08 },
            { time: 1643, volume: 0.1 },
            { time: 1658, volume: 0.11 },
            { time: 1674, volume: 0.12 },
            { time: 1689, volume: 0.14 },
            { time: 1704, volume: 0.15 },
            { time: 1719, volume: 0.16 },
            { time: 1733, volume: 0.18 },
            { time: 1747, volume: 0.19 },
            { time: 1761, volume: 0.2 },
            { time: 1776, volume: 0.22 },
            { time: 1791, volume: 0.23 },
            { time: 1806, volume: 0.24 },
            { time: 1821, volume: 0.26 },
            { time: 1835, volume: 0.27 },
            { time: 1850, volume: 0.29 },
            { time: 1865, volume: 0.3 },
            { time: 1881, volume: 0.31 },
            { time: 1897, volume: 0.33 },
            { time: 1912, volume: 0.34 },
            { time: 1928, volume: 0.35 },
            { time: 1944, volume: 0.37 },
            { time: 1960, volume: 0.38 },
            { time: 1977, volume: 0.39 },
            { time: 1994, volume: 0.41 },
            { time: 2012, volume: 0.42 },
            { time: 2030, volume: 0.44 },
            { time: 2049, volume: 0.45 },
            { time: 2067, volume: 0.46 },
            { time: 2086, volume: 0.48 },
            { time: 2104, volume: 0.49 },
            { time: 2123, volume: 0.5 },
            { time: 2142, volume: 0.52 },
            { time: 2161, volume: 0.53 },
            { time: 2179, volume: 0.54 },
            { time: 2197, volume: 0.56 },
            { time: 2215, volume: 0.57 },
            { time: 2232, volume: 0.59 },
            { time: 2249, volume: 0.6 },
            { time: 2267, volume: 0.61 },
            { time: 2284, volume: 0.63 },
            { time: 2302, volume: 0.64 },
            { time: 2320, volume: 0.65 },
            { time: 2339, volume: 0.67 },
            { time: 2358, volume: 0.68 },
            { time: 2378, volume: 0.7 },
            { time: 2397, volume: 0.71 },
            { time: 2417, volume: 0.72 },
            { time: 2436, volume: 0.74 },
            { time: 2454, volume: 0.75 },
            { time: 2472, volume: 0.76 },
            { time: 2490, volume: 0.78 },
            { time: 2508, volume: 0.79 },
            { time: 2526, volume: 0.8 },
            { time: 2545, volume: 0.82 },
            { time: 2564, volume: 0.83 },
            { time: 2583, volume: 0.85 },
            { time: 2602, volume: 0.86 },
            { time: 2622, volume: 0.87 },
            { time: 2641, volume: 0.89 },
            { time: 2662, volume: 0.9 },
            { time: 2682, volume: 0.91 },
            { time: 2703, volume: 0.93 },
            { time: 2723, volume: 0.94 },
            { time: 2742, volume: 0.96 },
            { time: 2761, volume: 0.97 },
            { time: 2780, volume: 0.98 },
            { time: 2799, volume: 1 },
            { time: 2818, volume: 1.01 },
            { time: 2838, volume: 1.02 },
            { time: 2859, volume: 1.04 },
            { time: 2881, volume: 1.05 },
            { time: 2903, volume: 1.07 },
            { time: 2926, volume: 1.08 },
            { time: 2950, volume: 1.09 },
            { time: 2974, volume: 1.11 },
            { time: 2997, volume: 1.12 },
            { time: 3021, volume: 1.14 },
            { time: 3043, volume: 1.15 },
            { time: 3066, volume: 1.16 },
            { time: 3090, volume: 1.18 },
            { time: 3115, volume: 1.19 },
            { time: 3141, volume: 1.2 },
            { time: 3167, volume: 1.22 },
            { time: 3194, volume: 1.23 },
            { time: 3220, volume: 1.24 },
            { time: 3246, volume: 1.26 },
            { time: 3271, volume: 1.27 },
            { time: 3297, volume: 1.29 },
            { time: 3322, volume: 1.3 },
            { time: 3348, volume: 1.31 },
            { time: 3374, volume: 1.33 },
            { time: 3401, volume: 1.34 },
            { time: 3430, volume: 1.35 },
            { time: 3459, volume: 1.36 },
            { time: 3488, volume: 1.38 },
            { time: 3518, volume: 1.39 },
            { time: 3548, volume: 1.4 },
            { time: 3577, volume: 1.42 },
            { time: 3604, volume: 1.43 },
            { time: 3631, volume: 1.45 },
            { time: 3658, volume: 1.46 },
            { time: 3684, volume: 1.47 },
            { time: 3710, volume: 1.49 },
            { time: 3735, volume: 1.5 },
            { time: 3761, volume: 1.52 },
            { time: 3786, volume: 1.53 },
            { time: 3811, volume: 1.54 },
            { time: 3837, volume: 1.56 },
            { time: 3863, volume: 1.57 },
            { time: 3888, volume: 1.58 },
            { time: 3913, volume: 1.6 },
            { time: 3938, volume: 1.61 },
            { time: 3963, volume: 1.63 },
            { time: 3988, volume: 1.64 },
            { time: 4014, volume: 1.66 },
            { time: 4041, volume: 1.67 },
            { time: 4066, volume: 1.68 },
            { time: 4091, volume: 1.69 },
            { time: 4115, volume: 1.71 },
            { time: 4139, volume: 1.72 },
            { time: 4161, volume: 1.73 },
            { time: 4183, volume: 1.75 },
            { time: 4204, volume: 1.76 },
            { time: 4225, volume: 1.78 },
            { time: 4245, volume: 1.79 },
            { time: 4266, volume: 1.8 },
            { time: 4286, volume: 1.82 },
            { time: 4306, volume: 1.83 },
            { time: 4326, volume: 1.85 },
            { time: 4346, volume: 1.86 },
            { time: 4366, volume: 1.87 },
            { time: 4387, volume: 1.89 },
            { time: 4407, volume: 1.9 },
            { time: 4428, volume: 1.91 },
            { time: 4449, volume: 1.93 },
            { time: 4470, volume: 1.94 },
            { time: 4492, volume: 1.96 },
            { time: 4513, volume: 1.97 },
            { time: 4534, volume: 1.98 },
            { time: 4555, volume: 2 },
            { time: 4576, volume: 2.01 },
            { time: 4597, volume: 2.02 },
            { time: 4619, volume: 2.04 },
            { time: 4641, volume: 2.05 },
            { time: 4662, volume: 2.07 },
            { time: 4685, volume: 2.08 },
            { time: 4707, volume: 2.09 },
            { time: 4730, volume: 2.11 },
            { time: 4753, volume: 2.12 },
            { time: 4776, volume: 2.13 },
            { time: 4799, volume: 2.15 },
            { time: 4823, volume: 2.16 },
            { time: 4846, volume: 2.18 },
            { time: 4870, volume: 2.19 },
            { time: 4893, volume: 2.2 },
            { time: 4916, volume: 2.22 },
            { time: 4939, volume: 2.23 },
            { time: 4962, volume: 2.25 },
            { time: 4985, volume: 2.26 },
            { time: 5007, volume: 2.27 },
            { time: 5028, volume: 2.29 },
            { time: 5048, volume: 2.3 },
            { time: 5068, volume: 2.31 },
            { time: 5086, volume: 2.33 },
            { time: 5104, volume: 2.34 },
            { time: 5122, volume: 2.36 },
            { time: 5140, volume: 2.37 },
            { time: 5158, volume: 2.38 },
            { time: 5176, volume: 2.4 },
            { time: 5194, volume: 2.41 },
            { time: 5212, volume: 2.42 },
            { time: 5230, volume: 2.44 },
            { time: 5248, volume: 2.45 },
            { time: 5266, volume: 2.47 },
            { time: 5284, volume: 2.48 },
            { time: 5303, volume: 2.49 },
            { time: 5321, volume: 2.51 },
            { time: 5338, volume: 2.52 },
            { time: 5355, volume: 2.53 },
            { time: 5372, volume: 2.55 },
            { time: 5389, volume: 2.56 },
            { time: 5406, volume: 2.57 },
            { time: 5424, volume: 2.59 },
            { time: 5441, volume: 2.6 },
            { time: 5459, volume: 2.62 },
            { time: 5476, volume: 2.63 },
            { time: 5494, volume: 2.64 },
            { time: 5512, volume: 2.66 },
            { time: 5530, volume: 2.67 },
            { time: 5548, volume: 2.68 },
            { time: 5566, volume: 2.7 },
            { time: 5585, volume: 2.71 },
            { time: 5604, volume: 2.72 },
            { time: 5623, volume: 2.74 },
            { time: 5641, volume: 2.75 },
            { time: 5660, volume: 2.77 },
            { time: 5679, volume: 2.78 },
            { time: 5697, volume: 2.79 },
            { time: 5716, volume: 2.81 },
            { time: 5735, volume: 2.82 },
            { time: 5753, volume: 2.83 },
            { time: 5771, volume: 2.85 },
            { time: 5790, volume: 2.86 },
            { time: 5808, volume: 2.88 },
            { time: 5827, volume: 2.89 },
            { time: 5846, volume: 2.9 },
            { time: 5865, volume: 2.92 },
            { time: 5884, volume: 2.93 },
            { time: 5904, volume: 2.94 },
            { time: 5924, volume: 2.96 },
            { time: 5945, volume: 2.97 },
            { time: 5965, volume: 2.99 },
            { time: 5985, volume: 3 },
            { time: 6005, volume: 3.01 },
            { time: 6025, volume: 3.03 },
            { time: 6044, volume: 3.04 },
            { time: 6063, volume: 3.05 },
            { time: 6083, volume: 3.07 },
            { time: 6103, volume: 3.08 },
            { time: 6123, volume: 3.1 },
            { time: 6143, volume: 3.11 },
            { time: 6164, volume: 3.12 },
            { time: 6185, volume: 3.14 },
            { time: 6206, volume: 3.15 },
            { time: 6227, volume: 3.16 },
            { time: 6249, volume: 3.18 },
            { time: 6271, volume: 3.19 },
            { time: 6292, volume: 3.21 },
            { time: 6313, volume: 3.22 },
            { time: 6335, volume: 3.23 },
            { time: 6355, volume: 3.25 },
            { time: 6376, volume: 3.26 },
            { time: 6396, volume: 3.27 },
            { time: 6416, volume: 3.29 },
            { time: 6436, volume: 3.3 },
            { time: 6457, volume: 3.32 },
            { time: 6479, volume: 3.33 },
            { time: 6501, volume: 3.34 },
            { time: 6524, volume: 3.36 },
            { time: 6549, volume: 3.37 },
            { time: 6574, volume: 3.38 },
            { time: 6601, volume: 3.4 },
            { time: 6629, volume: 3.41 },
            { time: 6658, volume: 3.42 },
            { time: 6688, volume: 3.44 },
            { time: 6718, volume: 3.45 },
            { time: 6749, volume: 3.46 },
            { time: 6781, volume: 3.47 },
            { time: 6813, volume: 3.49 },
            { time: 6845, volume: 3.5 },
            { time: 6878, volume: 3.51 },
            { time: 6912, volume: 3.53 },
            { time: 6947, volume: 3.54 },
            { time: 6984, volume: 3.55 },
            { time: 7023, volume: 3.56 },
            { time: 7065, volume: 3.58 },
            { time: 7110, volume: 3.59 },
            { time: 7156, volume: 3.6 },
            { time: 7200, volume: 3.61 },
            { time: 7244, volume: 3.63 },
            { time: 7287, volume: 3.64 },
            { time: 7331, volume: 3.66 },
            { time: 7376, volume: 3.67 },
            { time: 7421, volume: 3.68 },
            { time: 7465, volume: 3.7 },
            { time: 7507, volume: 3.71 },
            { time: 7549, volume: 3.72 },
            { time: 7593, volume: 3.74 },
            { time: 7638, volume: 3.75 },
            { time: 7686, volume: 3.76 },
            { time: 7735, volume: 3.77 },
            { time: 7788, volume: 3.79 },
            { time: 7843, volume: 3.8 },
            { time: 7904, volume: 3.81 },
            { time: 7971, volume: 3.82 },
            { time: 8047, volume: 3.82 },
            { time: 8131, volume: 3.83 },
            { time: 8220, volume: 3.84 },
            { time: 8314, volume: 3.85 },
            { time: 8440, volume: 3.85 },
            { time: 8440, volume: 3.85 }
        ];
    }
}