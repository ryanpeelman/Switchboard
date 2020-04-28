import React from 'react';

import PatientRepository from '../../services/PatientRepository';

import PatientGuideView from './PatientGuideView';
import SFNavigationComponent from '../../components/SF/SFNavigationComponent';
import SFTabStripComponent from '../../components/SF/SFTabStripComponent';


export default class PatientGuideViewContainer extends React.Component {
	constructor() {
		super();

		this.state = {
			isExpanded: false,
			drilldownPatient: null
        }
        
        this.patientRepository = new PatientRepository();

        this.collapse = this.collapse.bind(this);
        this.expand = this.expand.bind(this);
        this.launchDrilldown = this.launchDrilldown.bind(this);
        this.setDrilldownPatient = this.setDrilldownPatient.bind(this);
    }

	collapse() {
		this.setState({ isExpanded: false });
	}

	expand() {
		this.setState({ isExpanded: true });
    }
    
    launchDrilldown(patientId) {
        const patient = this.patientRepository.getPatient(patientId);
        this.setDrilldownPatient(patient);
        this.expand();
    }

    setDrilldownPatient(patient) {
        this.setState({ drilldownPatient: patient });

        if(!patient) {
            this.collapse();
        }
    }

    render() {
        return (
            <div className="PatientGuideViewContainer">
                <SFNavigationComponent
                    currentUser={this.props.currentUser}
                    onSignOut={this.props.onSignOut} 
                    launchDrilldown={this.launchDrilldown} />

                <SFTabStripComponent
                    drilldownPatient={this.state.drilldownPatient}
                    setDrilldownPatient={this.setDrilldownPatient} />

                <PatientGuideView
                    currentUser={this.props.currentUser}
                    taskRepository={this.props.taskRepository}
                    drilldownPatient={this.state.drilldownPatient}
                    setDrilldownPatient={this.setDrilldownPatient}
                    isExpanded={this.state.isExpanded}
                    collapse={this.collapse}
                    expand={this.expand} 
                    patientRepository={this.patientRepository} 
                    launchDrilldown={this.launchDrilldown} />
            </div>
        );
    }
}
