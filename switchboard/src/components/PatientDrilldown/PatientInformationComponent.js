import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import DataDashboardComponent from '../DataDashboard/DataDashboardComponent';

export default class PatientInformationComponent extends React.Component {
    render() {
        return (
            <div className="PatientInformationComponent">
                <Tabs defaultIndex={2}>
                    <TabList>
                        <Tab>Study Timeline</Tab>
                        <Tab>Reported Outcomes</Tab>
                        <Tab>Device Data</Tab>
                        <Tab>Medical Records</Tab>
                    </TabList>

                    <TabPanel>
                        <p>Study Timeline</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Reported Outcomes</p>
                    </TabPanel>
                    <TabPanel>
                        <DataDashboardComponent user={this.props.patient} />
                    </TabPanel>
                    <TabPanel>
                        <p>Medical Records</p>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}