import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactSVG from 'react-svg';

import email from '../../assets/033 Email.svg';
import video from '../../assets/270 Video Camera.svg';

import POCHelperService from '../../services/POCHelperService';

import PatientVisitsComponent from './PatientVisitsComponent';
import StudyTeamComponent from '../StudyTeam/StudyTeamComponent';

export default class PatientConnectComponent extends React.Component {
    constructor() {
        super();

        this.team = POCHelperService.getStudyTeam();
    }

    render() {
        const patient = this.props.patient;

        return (
            <div className="patientConnect">
                <div className="patientID">
                    <div className="patientID-pic">
                        <div><img src={patient.profileImage} className='patientPic' alt={patient.displayName} /></div>
                        <div>
                            <button><ReactSVG path={email} className='email' accessibilityLabel="link to email" /></button>
                            <button><ReactSVG path={video} className='video' alt="link to video chat" /></button>
                        </div>
                    </div>
                    <div className="patientID-details">
                        <div>
                            <span>Subject ID</span>
                            <span>{patient.subjectId}</span>
                        </div>
                        <div className="editField">
                            <span>Status</span>
                            <span>{patient.status}</span>
                        </div>
                        <div className="editField">
                            <span>SecureConsent ID</span>
                            <span>{patient.secureConsentId}</span>
                        </div>
                    </div>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Upcoming Visits</Tab>
                        <Tab>Study Team</Tab>
                    </TabList>

                    <TabPanel>
                        <PatientVisitsComponent visits={patient.visits} />
                    </TabPanel>
                    <TabPanel>
                        <StudyTeamComponent team={this.team} />
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}