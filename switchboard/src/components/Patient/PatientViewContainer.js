import React from 'react';

import NavigationComponent from '../Navigation/NavigationComponent';
import PatientView from './PatientView';
import TelevisitSidebar from '../Televisit/TelevisitSidebar';

export default class PatientViewContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            isTelevisitActive: false, 
            isTelevisitFullScreen: false, 
            isTelevisitSidebarExpanded: false
        }

		this.setTelevisitActiveState = this.setTelevisitActiveState.bind(this);
		this.setTelevisitFullScreen = this.setTelevisitFullScreen.bind(this);

        this.collapse = this.collapse.bind(this);
        this.expand = this.expand.bind(this);
    }

    collapse() {
        this.setState({ isTelevisitSidebarExpanded: false });
    }

    expand() {
        this.setState({ isTelevisitSidebarExpanded: true });
    }

	setTelevisitActiveState(value) {
        if(value) {
            this.setState({ isTelevisitActive: true });
        } 
        else {
            this.setState({ isTelevisitActive: false, isTelevisitFullScreen: false });
        }
	}

	setTelevisitFullScreen(value) {
		this.setState({ isTelevisitFullScreen: value });
	}

    render() {
        const viewClass = "PatientViewContainer" +
            (this.state.isTelevisitActive ? " TelevisitActive" : "") +
            (this.state.isTelevisitFullScreen ? " TelevisitFullScreen" : "") +
            (this.state.isTelevisitSidebarExpanded ? " TelevisitSidebarExpanded" : "");

        return (
            <div>
                <div className={viewClass}>
                    <NavigationComponent currentUser={this.props.currentUser} onSignOut={this.props.onSignOut} />
                    {!this.state.isTelevisitFullScreen && <PatientView currentUser={this.props.currentUser} taskRepository={this.props.taskRepository} /> }
                    <div className="TelevisitSidebarPlaceholder"></div>
                </div>
                <TelevisitSidebar
                    currentUser={this.props.currentUser}
                    collapse={this.collapse}
                    expand={this.expand} 
                    isTelevisitActive={this.state.isTelevisitActive}
					isTelevisitFullScreen={this.state.isTelevisitFullScreen}
                    isTelevisitSidebarExpanded={this.state.isTelevisitSidebarExpanded} 
					setTelevisitActiveState={this.setTelevisitActiveState}
					setTelevisitFullScreen={this.setTelevisitFullScreen} />
            </div>
        );
    }
}