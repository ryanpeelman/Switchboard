import React from 'react';
import ReactSVG from 'react-svg';
import home from '../../assets/128 Home.svg';
import video from '../../assets/270 Video Camera.svg';

export default class PatientVisitsComponent extends React.Component {
    render() {
        const visits = this.props.visits;

        if (!visits) {
            return (<div><p>No Visits Scheduled!</p></div>);
        }

        const visitItems = visits.map((visit, index) =>
            <li key={`item-${index}`}>
                <div className="visitItem">
					<div>
						<button>
							{(visit.visitType === "home") && <ReactSVG path={home} className='home' />}
							{(visit.visitType === "televisit") && <ReactSVG path={video} className='video' />}
						</button>
						<span>Visit {index + 1}</span>
						<button>{visit.isScheduled ? "Reschedule" : "Schedule"}</button>
					</div>
                    <span>Date: {visit.date} {visit.isScheduled ? "(scheduled)" : "(expected)"}</span>
                    <div className="bLink"><span>i</span>View Details</div>
                </div>
            </li>
        );
        return (
            <div>
                <ul className="visitItems">{visitItems}</ul>
            </div>
        );
    }
}