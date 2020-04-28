import React from 'react';
import ReactSVG from 'react-svg';
import NotificationsComponent from '../Notifications/NotificationsComponent';

import logo from '../../assets/IQVIA-logo.jpg';
import dropdown from '../../assets/dropdown.svg';
import add from '../../assets/add.svg';
import gear from '../../assets/setup.svg';
import question from '../../assets/question.svg';

export default class SFNavigationComponent extends React.Component {
    render() {
        let user = this.props.currentUser;

        if (!user) {
            return null;
        }

        return (
            <div className="SFNavigationComponent">
                <div className="NavLeft">
                    <img src={logo} className='logo' alt="IQVIA" />
                </div>
                <div className="NavCenter">
                    <input type="text" placeholder="Search Study Hub" />
                </div>
                <div className="NavRight">
					<div className="siteSpeed">0s</div>
					<div className="siteSize">1273.44KB</div>
					<div className="dropdownMenu">
						<ReactSVG path={dropdown} className='icon' />
					</div>
                    <div className="buttonTray">	
                        <ReactSVG path={add} className='icon' />
                        <ReactSVG path={question} className='icon' />
                        <ReactSVG path={gear} className='icon' />
                        <NotificationsComponent
                            currentUser={this.props.currentUser}
                            isPatientGuide={true} 
                            launchDrilldown={this.props.launchDrilldown} />
                        <img src={user.profileImageSmall} className='avatar' alt={user.displayName} onClick={this.props.onSignOut}/>
                    </div>
                </div>
            </div>
        );
    }
}