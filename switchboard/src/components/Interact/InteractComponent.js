import React from 'react';
import ReactSVG from 'react-svg';

import chat from '../../assets/046 Conversation 2.svg';
import drug from '../../assets/179 Drug.svg';
import library from '../../assets/018 Library.svg';
import studyLogo from '../../assets/Study_Logo.png';
import team from '../../assets/122 People.svg';
import upload from '../../assets/065 Upload.svg';

export default class InteractComponent extends React.Component {
	render() {
		return (
			<div className="InteractComponent">
				<div className="title">
					<p>My Study</p>
				</div>
				<div className="content">
					<div className="logo">
						<img src={studyLogo} className="studyLogo" alt="study logo" />
						<span>The Moment Study</span>
					</div>
					<div className="links">
						<div className="link">
							<ReactSVG path={library} className='icon' />
							<div className="bLink">View Study Details</div>
						</div>
						<div className="link">
							<ReactSVG path={team} className='icon' />
							<div className="bLink">View Study Team</div>
						</div>

						<div className="link">
							<ReactSVG path={upload} className='icon' />
							<div className="bLink">Upload Medical Records</div>
						</div>
						<div className="link">
							<ReactSVG path={drug} className='icon' />
							<div className="bLink">Request Replacement Study Medication</div>
						</div>
					</div>
					<div className="contact">
						<div className="chat">
							<ReactSVG path={chat} className='icon' />
							<div className="start">
								<div className="bLink">Start a chat</div>
								<div className="status">Available</div>
							</div>
						</div>
						<div className="call">
							<div>Call directly</div>
							<div>1-800-988-3846</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
