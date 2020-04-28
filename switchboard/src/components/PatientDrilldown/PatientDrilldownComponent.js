/* TODO: this component is not used any more */

import React from 'react';

import PatientVisitRequestService from '../../services/PatientVisitRequestService';

import PatientInformationComponent from './PatientInformationComponent';
import VisitRequestedNotification from './VisitRequestedNotification';

export default class PatientDrilldownComponent extends React.Component {
	constructor() {
		super();

        this.state = {
            visitRequests: []
        };

		this.visitRequestService = new PatientVisitRequestService();
		
        this.back = this.back.bind(this);
        this.drilldown = this.drilldown.bind(this);
	}

	componentDidMount() {
		this.patients = this.props.patientRepository.getAllPatients();

        this.addVisitListener();
	}

    back() {
        this.props.setDrilldownPatient(null);
        this.props.collapse();
    }

    drilldown(patient) {
        this.props.setDrilldownPatient(patient);
        this.props.expand();
    }

    addVisitListener() {
        this.visitRequestService.addVisitListener((snapshot) => {

            //when visits table changes, update our local copy
            let visits = snapshot.val();

            let newVisits = [];
            for (let visit in visits) {
                newVisits.push({
                    userid: visits[visit].userid,
                    status: visits[visit].status
                });
            }

            this.setState({
                visitRequests: newVisits
            });
        });
    }

	render() {
		const patients = this.patients;
		if (!patients) {
			return null;
		}

		const drilldownPatient = this.props.drilldownPatient;
		if (drilldownPatient) {
			return <PatientInformationComponent patient={drilldownPatient} />
		}

		const patientLinks = patients.filter(x => !x.hasOwnProperty("isHidden")).map((patient, index) =>
			<li key={`item-${index}`}>
				<div className='patientDrilldownListEntry'>
					<div className="bLink" onClick={() => this.drilldown(patient)}>{patient.displayName}</div>
					<VisitRequestedNotification
						patient={patient}
						visitRequests={this.state.visitRequests}
						acceptVisitRequest={(patient) => this.drilldown(patient)} />
				</div>
			</li>
		);

		return (
			<div className="PatientDrilldownComponent">
				<div className="title">
					<span>My Patients</span>
				</div>
				<div className="PatientListComponent">
					<ul>
						{patientLinks}
					</ul>
				</div>
			</div>
		);
	}
}