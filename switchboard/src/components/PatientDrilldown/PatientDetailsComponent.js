import React from 'react';

export default class PatientDetailsComponent extends React.Component {
    render() {
        const patient = this.props.patient;

        return (
            <div className="patientDetails">
                <div className="patientName">
                    <span>Patient</span>
                    <span>{patient.displayName}</span>
                </div>
				<div className="patientDetailsList">
					<div>
						<span>Gender</span>
						<span>{patient.gender}</span>
					</div>              
					<div>
						<span>DOB</span>
						<span>{patient.dob}</span>
					</div>
					<div>
						<span>Phone Number</span>
						<span>{patient.phoneNumber}</span>
					</div>
					<div>
						<span>Location</span>
						<span>{patient.location}</span>
					</div>
					<div>
						<span>Visit Location</span>
						<span>{patient.visitLocation}</span>
					</div>
				</div>
            </div>
        );
    }
}