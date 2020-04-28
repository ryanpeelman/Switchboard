import React from 'react';

import POCHelperService from '../../services/POCHelperService';

import EDCComponent from '../EDC/EDCComponent';
import PatientDrilldownComponent from '../PatientDrilldown/PatientDrilldownComponent';
import PatientSummaryComponent from '../PatientSummary/PatientSummaryComponent';
import PatientStatusSummaryComponent from '../PatientStatusSummary/PatientStatusSummaryComponent';
import ScheduleComponent from '../Schedule/ScheduleComponent';
import TaskListComponent from '../TaskList/TaskListComponent';
import TelevisitComponent from '../Televisit/TelevisitComponent';

export default class PatientGuideView extends React.Component {
	constructor() {
		super();

		this.state = {
			tasks: null,
			isTelevisitActive: false,
			isTelevisitFullScreen: false
		}

		this.setTelevisitActiveState = this.setTelevisitActiveState.bind(this);
		this.setTelevisitFullScreen = this.setTelevisitFullScreen.bind(this);

		this.sketchySubcomponentTelevisitHook = null;
		this.setSketchySubcomponentTelevisitHook = this.setSketchySubcomponentTelevisitHook.bind(this);
	}

	componentDidMount() {
		const uid = this.props.currentUser.uid;
		this.props.taskRepository.getTasks(uid, (tasks) => {
			this.setState({ tasks: tasks });
		});
	}

	setSketchySubcomponentTelevisitHook(hook) {
		this.sketchySubcomponentTelevisitHook = hook;
	}

	setTelevisitActiveState(value) {
		this.setState({ isTelevisitActive: value });
	}

	setTelevisitFullScreen(value) {
		this.setState({ isTelevisitFullScreen: value });
	}

	render() {
		const patientSummaryData = POCHelperService.getPatientSummaryData();

		const launchTelevisitFunction = (patientId, title) => {
			if (this.sketchySubcomponentTelevisitHook) {
				const patient = this.props.patientRepository.getPatient(patientId);
				this.props.setDrilldownPatient(patient);
				this.sketchySubcomponentTelevisitHook(patient, title);
			}
		}

		const isExpanded = this.props.isExpanded;
		const isTelevisitActive = this.state.isTelevisitActive;
		const isTelevisitFullScreen = this.state.isTelevisitFullScreen;
		const viewClass = "PatientGuideView" +
			(isExpanded ? " ExpandedView" : "") +
			(isTelevisitActive ? " TelevisitActive" : "") +
			(isTelevisitFullScreen ? " TelevisitFullScreen" : "");

		return (
			<div className={viewClass}>
				<TaskListComponent
					tasks={this.state.tasks}
					user={this.props.currentUser}
					launchDrilldown={this.props.launchDrilldown} />
				<ScheduleComponent
					launchTelevisitFunction={launchTelevisitFunction} />
				<PatientDrilldownComponent
					isExpanded={isExpanded}
					collapse={this.props.collapse}
					expand={this.props.expand}
					drilldownPatient={this.props.drilldownPatient}
					setDrilldownPatient={this.props.setDrilldownPatient}
					patientRepository={this.props.patientRepository} />
				<TelevisitComponent
					user={this.props.currentUser}
					isExpanded={isExpanded}
					collapse={this.props.collapse}
					expand={this.props.expand}
					drilldownPatient={this.props.drilldownPatient}
					isTelevisitActive={this.state.isTelevisitActive}
					isTelevisitFullScreen={this.state.isTelevisitFullScreen}
					setTelevisitActiveState={this.setTelevisitActiveState}
					setTelevisitFullScreen={this.setTelevisitFullScreen}
					setSketchySubcomponentTelevisitHook={this.setSketchySubcomponentTelevisitHook}
				/>
				<PatientStatusSummaryComponent patientSummaryData={patientSummaryData} />
				<PatientSummaryComponent patient={this.props.drilldownPatient} />
				<EDCComponent />
			</div>
		);
	}
}