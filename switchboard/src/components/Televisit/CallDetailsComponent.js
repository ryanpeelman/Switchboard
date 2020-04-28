import React from 'react';

import CallChecklistComponent from './CallChecklistComponent';
import ParticipantListComponent from './ParticipantListComponent';

export default class CallDetailsComponent extends React.Component {
    render() {
        return (
            <div className="CallDetailsComponent">
                <div>
                    <CallChecklistComponent checklistEntries={this.props.checklistEntries} />
                </div>
                <div>
                    <ParticipantListComponent participants={this.props.participants} patientIsOnline={this.props.patientIsOnline} />
                </div>
            </div>
        );
    }
}