import React from 'react';

import POCHelperService from '../../services/POCHelperService';

import StudyTeamComponent from '../StudyTeam/StudyTeamComponent';

export default class PatientSummaryComponent extends React.Component {
	constructor() {
		super();

		this.team = POCHelperService.getStudyTeam();
	}

	render() {
		const patient = this.props.patient;
		if (!patient) {
			return null;
		}

		return (
			<div className="PatientSummaryComponent">
				<div className="patientSummaryContainer">
					<div className="patientInformation">
						<div><img src={patient.profileImage} className='patientPic' alt={patient.displayName} /></div>
						<div>
							<label>{patient.displayName}</label>
							<div>{patient.dob}</div>
						</div>
						<div className="studyDetails">
							<div>
								<label>Study:</label>
								<span>{patient.study}</span>
							</div>
							<div>
								<label>Status:</label>
								<span>{patient.status}</span>
							</div>
						</div>
					</div>
					
					<div className="patientContact">
						<div>
							<label>Phone:</label>
							<span>{patient.phoneNumber}</span>
						</div>
						<div>
							<label>Location:</label>
							<span>{patient.location}</span>
						</div>
						<div>
							<label>Emergency Contact:</label>
							{patient.emergencyContact &&
								<p>
									{patient.emergencyContact.name}, {patient.emergencyContact.relationship} <br />
									{patient.emergencyContact.phoneNumber}
								</p>
							}
						</div>
					</div>
					<div className="patientIDs">
						<div>
							<label>Subject ID:</label>
							<span>{patient.subjectId}</span>
						</div>
						<div>
							<label>Randomization ID:</label>
							<span>{patient.randomizationId}</span>
						</div>
						<div>
							<label>Secure Consent ID:</label>
							<span>{patient.secureConsentId}</span>
						</div>
					</div>
				</div>
				<StudyTeamComponent team={this.team} />
			</div>
		);
	}
}