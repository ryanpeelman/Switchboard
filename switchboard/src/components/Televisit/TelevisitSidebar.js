import React from 'react';

import TelevisitComponent from '../Televisit/TelevisitComponent';
import TelevisitPopOutTab from '../Televisit/TelevisitPopOutTab';

export default class TelevisitSidebar extends React.Component {
	constructor() {
		super();

		this.state = {
			showPopOutTab: false
		};

		this.setShowPopOutTab = this.setShowPopOutTab.bind(this);
	}

	setShowPopOutTab(show) {
		this.setState({ showPopOutTab: show });
	}

    render() {
        const isTelevisitActive = this.props.isTelevisitActive;
        const isTelevisitFullScreen = this.props.isTelevisitFullScreen;
        const isTelevisitSidebarExpanded = this.props.isTelevisitSidebarExpanded;
        const viewClass = "TelevisitSidebar" +
            (isTelevisitActive ? " TelevisitActive" : "") +
            (isTelevisitFullScreen ? " TelevisitFullScreen" : "") +
            (isTelevisitSidebarExpanded ? " TelevisitSidebarExpanded" : "");

        return (
            <div className={viewClass}>
                <TelevisitComponent
                    user={this.props.currentUser}
                    isExpanded={isTelevisitSidebarExpanded}
                    collapse={this.props.collapse}
                    expand={this.props.expand}
                    isTelevisitActive={isTelevisitActive}
                    isTelevisitFullScreen={isTelevisitFullScreen}
                    setTelevisitActiveState={this.props.setTelevisitActiveState}
					setTelevisitFullScreen={this.props.setTelevisitFullScreen}
					setShowPopOutTab={this.setShowPopOutTab} />
				{
					this.state.showPopOutTab && 
					<TelevisitPopOutTab user={this.props.currentUser} isExpanded={isTelevisitSidebarExpanded} />
				}
            </div>
        );
    }
}
