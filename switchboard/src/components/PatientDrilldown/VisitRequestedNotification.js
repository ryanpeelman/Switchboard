/* TODO: this component is not used any more */

import React from 'react';
import ReactSVG from 'react-svg';

import notificationIcon from '../../assets/171 Notification.svg';

import PatientVisitRequestService from '../../services/PatientVisitRequestService';

export default class VisitRequestedNotification extends React.Component {
    render() {

        //implement callback for when user clicks on request notification object
        let notificationClicked = (patient) => {
            //call the callback provided by parent container (which will act as if the user drilled down)
            this.props.acceptVisitRequest(patient);

            //update status in firebase DB
            new PatientVisitRequestService().updateStatus(patient.uid, 'serverAccepted');
        };


        //check if visitRequests contains a request for the current user
        for (let request in this.props.visitRequests) {
            if ((this.props.visitRequests[request].userid === this.props.patient.uid) && (this.props.visitRequests[request].status === 'clientRequested')) {
                //got a match
                return (
                    <div className="bLink" onClick={ () => notificationClicked(this.props.patient) }><ReactSVG path={notificationIcon} className='notificationIcon' /></div>
                );
            }
        }

        //no matches, return nothing
        return(<p></p>);
    }
}