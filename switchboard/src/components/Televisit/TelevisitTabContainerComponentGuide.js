import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import POCHelperService from '../../services/POCHelperService';

import CallDetailsComponent from './CallDetailsComponent';
import PatientSummaryComponent from '../PatientSummary/PatientSummaryComponent';

export default class TelevisitTabContainerComponentGuide extends React.Component {

	render() {
		const checklistEntries = POCHelperService.getChecklistEntries();

		const viewClass = "TelevisitTabContainerComponent";// + (this.props.isExpanded ? "" : " hidden");

		return (
			<div className={viewClass}>
				<Tabs>
					<TabList>
						<Tab>Televisit</Tab>
						<Tab>Call Details</Tab>
						<Tab>Patient Summary</Tab>
					</TabList>

					<TabPanel forceRender={true}>
						{this.props.renderVideoSessionComponent()}
					</TabPanel>
					<TabPanel>
						<CallDetailsComponent participants={this.props.participants} patientIsOnline={this.props.patientIsOnline} checklistEntries={checklistEntries} />
					</TabPanel>
					<TabPanel>
						<PatientSummaryComponent patient={this.props.patient} />
					</TabPanel>
				</Tabs>
			</div>
		);
	}
}