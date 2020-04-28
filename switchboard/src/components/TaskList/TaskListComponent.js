import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import POCHelperService from '../../services/POCHelperService';

import TaskListCategoryStripComponent from './TaskListCategoryStripComponent';
import TaskListTable from './TaskListTable';

export default class TaskListComponent extends React.Component {
	constructor() {
		super();

		this.state = {
			selectedCategoryNames: []
		};

		this.applyCategoryFilters = this.applyCategoryFilters.bind(this);
		this.updateSelectedCategoryNames = this.updateSelectedCategoryNames.bind(this);
	}

	applyCategoryFilters(tasks) {
		if (this.state.selectedCategoryNames.length === 0) {
			return tasks;
		}

		return tasks.filter(x => this.state.selectedCategoryNames.includes(x.category));
	}

	updateSelectedCategoryNames(selectedCategoryNames) {
		this.setState({ selectedCategoryNames: selectedCategoryNames });
	}

	render() {
		const tasks = POCHelperService.sanitizeTasksToCurrentDates(this.props.tasks);
		const filteredTasks = this.applyCategoryFilters(tasks);
		const openTasks = (filteredTasks !== null) ? filteredTasks.filter(task => task.isOpen) : null;
		const closedTasks = (filteredTasks !== null) ? filteredTasks.filter(task => !task.isOpen) : null;

		return (
			<div className="TaskListComponent">
				<div className="title"><p>My Task List</p></div>
				<Tabs>
					<TabList>
						<Tab>Open</Tab>
						<Tab>Closed</Tab>
					</TabList>

					<TabPanel>
						{
							this.props.user.isPatientGuide &&
							<TaskListCategoryStripComponent allTasks={tasks} tasks={openTasks} updateSelectedCategoryNames={this.updateSelectedCategoryNames} />
						}
						<TaskListTable tasks={openTasks} user={this.props.user} launchDrilldown={this.props.launchDrilldown} />
					</TabPanel>
					<TabPanel>
						{
							this.props.user.isPatientGuide &&
							<TaskListCategoryStripComponent allTasks={tasks} tasks={closedTasks} updateSelectedCategoryNames={this.updateSelectedCategoryNames} />
						}
						<TaskListTable tasks={closedTasks} user={this.props.user} launchDrilldown={this.props.launchDrilldown} />
					</TabPanel>
				</Tabs>
			</div>
		);
	}
}