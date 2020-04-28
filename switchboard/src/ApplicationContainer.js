import React from 'react';

import TaskRepository from './services/TaskRepository';

import AdminViewContainer from './components/Admin/AdminViewContainer'
import PatientGuideViewContainer from './components/PatientGuide/PatientGuideViewContainer';
import PatientViewContainer from './components/Patient/PatientViewContainer';

export default class ApplicationContainer extends React.Component {
    constructor() {
        super();

        this.taskRepository = new TaskRepository();
    }

    componentWillUnmount() {
        this.taskRepository.close();
    }

    render() {
        const currentUser = this.props.currentUser;
        if (!currentUser) {
            return null;
        }

        const isPatientGuide = currentUser.isPatientGuide;
        const isAdmin = currentUser.isAdmin;

        return (
            <div className="ApplicationContainer">
                {isAdmin && <AdminViewContainer currentUser={currentUser} onSignOut={this.props.onSignOut} />}
                {isPatientGuide && <PatientGuideViewContainer currentUser={currentUser} onSignOut={this.props.onSignOut} taskRepository={this.taskRepository} />}
                {!isAdmin && !isPatientGuide && <PatientViewContainer currentUser={currentUser} onSignOut={this.props.onSignOut} taskRepository={this.taskRepository} />}
            </div>
        );
    }
}