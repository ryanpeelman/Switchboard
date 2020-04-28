//video component used by the PatientGuide
import React from 'react';
import StartSessionComponent from './StartSessionComponent';
import TelevisitTabContainerComponentGuide from './TelevisitTabContainerComponentGuide';
import NotificationsBroker from '../../services/NotificationsBroker';
import TelevisitService from '../../services/TelevisitService';
import PatientRepository from '../../services/PatientRepository';
import PatientVisitRequestService from '../../services/PatientVisitRequestService';
import VideoSessionComponent from './VideoSessionComponent';
import POCHelperService from '../../services/POCHelperService';


export default class VideoComponentGuide extends React.Component {
    constructor() {
        super();

        this.closeSession = this.closeSession.bind(this);
        this.closePatientSession = this.closePatientSession.bind(this);
        this.createSession = this.createSession.bind(this);
        this.setPatientOnline = this.setPatientOnline.bind(this);

        this.notificationsBroker = new NotificationsBroker();
        this.televisitService = TelevisitService.getInstance();
        this.patientVisitRequestService = new PatientVisitRequestService();
        this.patientRepository = new PatientRepository();

        this.state = {
            apiKey: '',
            sessionId: '',
            token: '',
            isSessionAvailable: false,
            patientId: '',
            patientIsOnline: false
        };

        window.onbeforeunload = () => {
            //close any active sessions when navigating away
            this.closeSession(this.state.patientId);
        }
    }

    componentDidMount() {
        //do a check to see if Tokbox is running
        //(we won't ever actually open a room using our current userid)
		this.checkForSession(this.props.currentUser.uid);

		//clear any existing entries in visit request db
		this.patientVisitRequestService.clearRequests(this.props.currentUser.uid);


/* TODO: this is not used anymore
        //add listener for when we request or accept a visit
        //TODO: only listen to child modified events
        this.patientVisitRequestService.addVisitListener((snapshot) => {

            //check if session is already active (TODO: use better way to check for this)
            if (this.state.sessionId !== '') {
                return;
            }

            //get entry corresponding to our patientId
            snapshot.forEach(request => {
                //if status is 'serverAccepted', create a new session. This happens after we (the Patient Guide) accept the session in the PatientListComponent.
                if (request.val().status === 'serverAccepted') {
                    this.createSession(request.val().userid, "Televisit");
                }
            });
		});
*/
    }

    checkForSession(patientId) {
        const isSessionAvailableCallback = (isSessionAvailable) => {
            this.setState({ isSessionAvailable: isSessionAvailable });
        };
        this.televisitService.isSessionAvailable(patientId, isSessionAvailableCallback);
    }

    closePatientSession() {
        this.closeSession(this.state.patientId);
    }

    closeSession(patientId) {
        this.setState({ apiKey: '', sessionId: '', token: '', patientId: '', patientIsOnline: false });

        //this.collapseVideoComponent();

        this.televisitService.closeSession(patientId);

        this.props.setTelevisitActiveState(false);
        
        this.props.setTitle("");

		this.props.setTelevisitFullScreen(false);

		this.patientVisitRequestService.clearRequests(patientId);
    }

    createSession(patientId, title) {
		//TODO: check if session already exists
        this.setState({ patientId: patientId, patientIsOnline: false });
		this.props.setMinimized(false);

        const callback = (json) => this.createSessionCallback(json, patientId, title);
        this.televisitService.createSession(patientId, title, callback);
    }

    createSessionCallback(json, patientId, title) {
        if (json.error) {
            //don't show popup, as the televisit service has already done that
            this.setState({ apiKey: '', sessionId: '', token: '' });
            //TODO: prolly put this back in this.patientVisitRequestService.clearRequests(patientId);
            return;
        }

        this.setState({
            apiKey: json.apiKey,
            sessionId: json.sessionId,
            token: json.token
        });

        this.props.expandVideoComponent();

        this.props.setTelevisitActiveState(true);

		//TODO: check if session already exists
		this.patientVisitRequestService.newRequest(patientId);

        this.props.setTitle(title);

        this.notificationsBroker.createNotification(patientId, POCHelperService.createTelevisitNotification(this.props.currentUser.displayName));
    }

    setPatientOnline(isOnline) {
        this.setState({ patientIsOnline: isOnline });
    }

    getParticipants() {
        //get array of patients that are participating in this televisit
        var participants = [];

        //first add me
        participants.push(this.props.currentUser);

        //then add the remote participant(s). Right now we only have their id.
        const patientId = this.state.patientId;

        if (patientId !== '') {
            const patient = this.patientRepository.getPatient(patientId);

            if (patient !== null) {
                participants.push(patient);
            }
        }

        return participants;
    }

    render() {
        const participants = this.getParticipants();

        const renderVideoSessionComponent = () =>
            <VideoSessionComponent
                isPatientGuide = {true}
                apiKey={this.state.apiKey}
                sessionId={this.state.sessionId}
                token={this.state.token}
//                isExpanded={this.props.isExpanded}
                isTelevisitFullScreen = {this.props.isTelevisitFullScreen}
                closeSession={this.closePatientSession}
                setPatientOnline={this.setPatientOnline} />;

        //TODO: SERIOUSLY, DON'T EVER REALLY DO THIS!
        const sketchySubcomponentTelevisitHook = (patient, title) => {
            this.createSession(patient.uid, title);
        }
        this.props.setSketchySubcomponentTelevisitHook(sketchySubcomponentTelevisitHook);

        return (
            <div className="VideoComponent guide">
                <div className="videoSessionHeader">
                    <div className="sessionActions">
                        {
                            (this.state.apiKey === '') && 
                            !this.props.minimized && 
                            <StartSessionComponent
                                createSession={this.createSession}
                                drilldownPatient={this.props.drilldownPatient} />
                        }
                    </div>
                </div>
                {
                    (this.state.apiKey !== '') &&
                    <TelevisitTabContainerComponentGuide
                        participants={participants}
                        patientIsOnline={this.state.patientIsOnline}
//                        isExpanded={this.props.isExpanded}
//                        isTelevisitFullScreen={this.props.isTelevisitFullScreen}
                        patient={this.props.drilldownPatient}
                        renderVideoSessionComponent={renderVideoSessionComponent} />
                }
                {
                    (this.state.apiKey === '') && 
                    !this.props.minimized && 
                    <div class="televisitNotStartedConatiner">
                        <div className="pipPlaceholderContainer">
                            <div className="pipPlaceholder" />
                            <div className="pipPlaceholder" />
                        </div>
                        <div className="message">Video conference has not started yet</div>
                    </div>
                }
            </div>
        );
    }
}