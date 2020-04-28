import React from 'react';

import firebase from '../../services/firebase';
import EventDataMapper from './EventDataMapper';

import HeartRateContainerComponent from './HeartRate/HeartRateContainerComponent';
import MedicationComplianceContainerComponent from './MedicationCompliance/MedicationComplianceContainerComponent';
import SpirometryContainerComponent from './Spirometry/SpirometryContainerComponent';

export default class DataDashboardComponent extends React.Component {
	constructor() {
		super();

		this.state = {
			events: [],
			heartrateEventData: [], 
			medicationComplianceEventData: [], 
			spirometryEventData: []
		}
	}

	componentDidMount() {
		var callback = (events) => {
			var heartrateEventData = EventDataMapper.getMappedData(events, 'heartrate');
			var medicationComplianceEventData = EventDataMapper.getMappedData(events, 'pillcompliance');
			var spirometryEventData = EventDataMapper.getMappedData(events, 'spirometry');
			this.setState({ 
				events: events, 
				heartrateEventData: heartrateEventData, 
				medicationComplianceEventData: medicationComplianceEventData, 
				spirometryEventData: spirometryEventData 
			});
		}

		this.loadData(callback);
	}

	componentWillUnmount() {
		firebase.database().ref('events').off();
	}

	render() {
		return (
			<div className="DataDashboardComponent">
				<MedicationComplianceContainerComponent eventData={this.state.medicationComplianceEventData} uid={this.props.user.uid} />
				<HeartRateContainerComponent eventData={this.state.heartrateEventData} />
				<SpirometryContainerComponent eventData={this.state.spirometryEventData} />
			</div>
		);
	}

	loadData(callback) {
		const userId = this.props.user.uid;
		const eventsReference = firebase.database().ref('events');
		const query = eventsReference.orderByChild('userid').equalTo(userId);
		query.on('value', (snapshot) => {
			let sourceEvents = snapshot.val();
			let events = EventDataMapper.getMappedDataFromSource(sourceEvents);
			callback(events);
		});
	}
}
