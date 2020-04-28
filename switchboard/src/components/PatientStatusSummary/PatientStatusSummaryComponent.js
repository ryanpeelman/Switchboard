import React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export default class PatientStatusSummaryComponent extends React.Component {
	render() {
		const activeData = this.props.patientSummaryData.active;
		const notActiveData = this.props.patientSummaryData.notActive;

		let patientCount = 0;
		for (var category in activeData) {
			patientCount += activeData[category].value;
		}

		return (
			<div className="PatientStatusSummaryComponent">
				<div className="title"><p>My Patients</p></div>
				<Tabs>
					<TabList>
						<Tab>{patientCount} Active</Tab>
						<Tab>Not Active</Tab>
					</TabList>

					<TabPanel>
						<BarChart data={activeData} width={300} height={165} layout='vertical'>
							<XAxis type='number' hide={true} axisLine={false} tickLine={false} />
							<YAxis dataKey='name' type='category' width={100} axisLine={false} tickLine={false} />
							<Bar dataKey='value' barSize={20} fill='#297dfd' label={{ fill: 'white', fontSize: 14 }} />
						</BarChart>
					</TabPanel>
					<TabPanel>
						<BarChart data={notActiveData} width={300} height={165} layout='vertical'>
							<XAxis type='number' hide={true} axisLine={false} tickLine={false} />
							<YAxis dataKey='name' type='category' width={100} axisLine={false} tickLine={false} />
							<Bar dataKey='value' barSize={20} fill='#297dfd' label={{ fill: 'white', fontSize: 14 }} />
						</BarChart>
					</TabPanel>
				</Tabs>
			</div>
		);
	}
}
