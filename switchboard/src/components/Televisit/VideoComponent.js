//video component used by the Patient
import React from 'react';

import CallChecklistComponent from './CallChecklistComponent';
import ParticipantListComponent from './ParticipantListComponent';
import VideoSessionComponent from './VideoSessionComponent';

import POCHelperService from '../../services/POCHelperService';
import TelevisitService from '../../services/TelevisitService';
//import PopupService from '../../services/PopupService';
import PatientVisitRequestService from '../../services/PatientVisitRequestService';


export default class VideoComponent extends React.Component {
    constructor() {
        super();

        this.closeSession = this.closeSession.bind(this);
        this.joinSession = this.joinSession.bind(this);
        this.joinSessionCallback = this.joinSessionCallback.bind(this);
        //this.requestSession = this.requestSession.bind(this);

        this.televisitService = TelevisitService.getInstance();
        this.patientVisitRequestService = new PatientVisitRequestService();

        this.state = {
            apiKey: '',
            sessionId: '',
            token: '',
            hasRequestedASession: false,
            isSessionAvailable: false,
            patientId: ''
        };
    }

    componentDidMount() {
        const patientId = this.props.currentUser.uid;
        this.setState({ patientId: patientId });
        this.checkForSession(patientId);

		this.televisitService.addJoinSessionCallback(this.joinSessionCallback);
		
        //add listener for when the PG creates a session
        //TODO: only listen to child modified events
        this.patientVisitRequestService.addVisitListener((snapshot) => {
			var foundEntry = false; //TODO: I don't know why I can't just return when I find an entry, without the code dropping through

            //get entry corresponding to our patientId
            snapshot.forEach(request => {
				if (request.val().userid === patientId) {
					//if status is 'serverCreated', enable the televisit tab
					if (request.val().status === 'serverCreated') {
						this.props.setShowPopOutTab(true);
						foundEntry = true;
						return;		//<- this doesn't actually return ?!?
					}
				}
			});
			
			if (!foundEntry) {
				this.props.setShowPopOutTab(false);
			}
		});
    }

    checkForSession(patientId) {
        const isSessionAvailableCallback = (isSessionAvailable) => {
            this.setState({ isSessionAvailable: isSessionAvailable });
        };

        this.televisitService.isSessionAvailable(patientId, isSessionAvailableCallback);
    }

    closeSession() {

        //also remove this listener
        //this.patientVisitRequestService.removeVisitListener(theListener);

        this.setState({ apiKey: '', sessionId: '', token: '' });

        this.checkForSession(this.state.patientId);

        this.props.setTelevisitActiveState(false);

        this.props.setTitle("");

        this.props.collapseVideoComponent();
    }

    joinSession(patientId) {
        this.televisitService.joinSession(patientId);
    }

    joinSessionCallback(json) {
        if (json.error) {
            //don't show popup, as the televisit service has already done that
            this.setState({ apiKey: '', sessionId: '', token: '', hasRequestedASession: false, isSessionAvailable: false });
            this.patientVisitRequestService.clearRequests(this.state.patientId);

            return;
        }

        this.setState({
            apiKey: json.apiKey,
            sessionId: json.sessionId,
            token: json.token
        });

        this.props.expandVideoComponent();

        this.props.setTelevisitActiveState(true);

        this.setState({ hasRequestedASession: false });

        this.props.setTitle(json.title ? json.title : "Televisit Session Z");
    }
/* TODO: this is not used any more
    requestSession(patient) {
        this.setState({ hasRequestedASession: true });

        //issue request
        const callback = (patientId) => this.requestSessionCallback(patientId);
        this.televisitService.requestSession(patient, callback);
    }

    requestSessionCallback(patientId) {
        //listen for the server to accept the request
        //TODO: only listen on my user node, not the entire database
        var theListener = this.patientVisitRequestService.addVisitListener((snapshot) => {
            //get entry corresponding to our patientId
            var matchingEntryFound = false;

            snapshot.forEach(entry => {
                if (entry.val().userid === this.state.patientId) {
                    matchingEntryFound = true;

                    //if status is 'sessionCreated', join the session
                    if (entry.val().status === 'sessionCreated') {
                        this.checkForSession(this.state.patientId);
                    }
                }
            });

            //if there is no entry for me, most likely the Patient Guide removed it after closing the session
            if (!matchingEntryFound) {
                new PopupService().showNotification("The Patient Guide closed the Televisit session", "Video Component Message");

                this.setState({ hasRequestedASession: false });
                this.patientVisitRequestService.removeVisitListener(theListener);
                theListener = null;

                this.closeSession();
            }
        });
    }
*/
    getParticipants() {
        //get array of patients that are participating in this televisit
        var participants = [];

        //first add me
        participants.push(this.props.currentUser);

        //then add the remote participant(s). For now just hard-code it; eventually we will have to retrieve the Patient Guide data somehow
        if (this.state.apiKey !== '') {
            participants.push(POCHelperService.getPatientGuideRecord());
        }

        return participants;
    }

    render() {
        const patientId = this.state.patientId;
		const videoComponentClassName = "VideoComponent" + (this.props.isTelevisitFullScreen ? " fullScreen" : "");

        const JoinActionsComponent =
            <div>
                <div className="bLink" onClick={() => this.joinSession(patientId)}>Join Session Now!</div>
            </div>;

        const WaitingComponent =
            <div>
                {
                    !this.state.hasRequestedASession &&
                    <div className="bLink" onClick={() => this.requestSession(this.props.currentUser)}>Request a televisit session</div>}
                {
                    this.state.hasRequestedASession &&
                    <span>Waiting on Patient Guide to start session...</span>
                }
            </div>;

        return (
            <div className={videoComponentClassName}>
                <div className="videoSessionHeader">
                    <div className="sessionActions">
                        {false && !this.state.isSessionAvailable && WaitingComponent}
                        {false && this.state.isSessionAvailable && (this.state.apiKey === '') && JoinActionsComponent}
                    </div>
                </div>
				{(this.state.apiKey !== '') &&
					<div className="videoSessionMain">
						<VideoSessionComponent
							isPatientGuide = {false}
							apiKey={this.state.apiKey}
							sessionId={this.state.sessionId}
							token={this.state.token}
							isExpanded={this.props.isExpanded}
							isTelevisitFullScreen = {this.props.isTelevisitFullScreen}
							closeSession={this.closeSession} />

						<div className="sideComponents">
						<CallChecklistComponent
							checklistEntries={POCHelperService.getChecklistEntries()}
							isTelevisitFullScreen = {this.props.isTelevisitFullScreen} />
						<ParticipantListComponent
							participants={this.getParticipants()}
							patientIsOnline={true}
							isTelevisitFullScreen = {this.props.isTelevisitFullScreen} />
						</div>
					</div>
				}
            </div>
        );
    }
}
