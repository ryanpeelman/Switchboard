import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import POCHelperService from '../../services/POCHelperService';

import CallChecklistComponent from './CallChecklistComponent';
import ParticipantListComponent from './ParticipantListComponent';

export default class TelevisitTabContainerComponent extends React.Component {

	render() {

		const checklistEntries = POCHelperService.getChecklistEntries();

		const viewClass = "TelevisitTabContainerComponent" + (this.props.isExpanded ? "" : " hidden");
		
		return (
			<div className={viewClass}>
				<Tabs>
					<TabList>
						<Tab>Televisit</Tab>
						<Tab>Participants</Tab>
						<Tab>Call Checklist</Tab>
					</TabList>
 
					<TabPanel forceRender={true}>
						{this.props.renderVideoSessionComponent()}
					</TabPanel>
					<TabPanel>
						<ParticipantListComponent participants={this.props.participants} patientIsOnline={this.props.patientIsOnline} />
					</TabPanel>
					<TabPanel>
						<CallChecklistComponent checklistEntries={checklistEntries} />
					</TabPanel>
				</Tabs>
			</div>
		);
	}
}