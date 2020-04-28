import React from 'react';

import TimelineRepository from '../../services/TimelineRepository';

import InteractComponent from '../Interact/InteractComponent';
import TaskListComponent from '../TaskList/TaskListComponent';
import TimelineComponent from '../Timeline/TimelineComponent';

export default class PatientView extends React.Component {
	constructor() {
		super();

		this.timelineRepository = new TimelineRepository();
	}

	render() {
		if (!this.props.currentUser) {
			return null;
		}

		const timelineEvents = this.timelineRepository.getTimelineEvents();

		const taskRepository = this.props.taskRepository;
		const tasks = taskRepository.getTasks();

		return (
			<div className="HomePage">
				<div className="pageTitle"><span>Home</span></div>
				<div className="PatientView">
					<TaskListComponent
						tasks={tasks}
						user={this.props.currentUser} />
					<InteractComponent />
					<TimelineComponent timelineEvents={timelineEvents} />
				</div>
			</div>
		);
	}
}