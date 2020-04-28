import React from 'react';
import ReactSVG from 'react-svg';
import goback from '../../assets/012 Left.svg';

import PatientConnectComponent from './PatientConnectComponent';
import PatientDetailsComponent from './PatientDetailsComponent';
import PatientInformationComponent from './PatientInformationComponent';

export default class PatientRecordComponent extends React.Component {
    render() {
        return (
			
            <div className="PatientRecordComponent">
				<div className="bLink goBack" onClick={() => this.props.back()}><ReactSVG path={goback} className='arrowLeft' /></div>
                <PatientDetailsComponent patient={this.props.patient} />
                <PatientConnectComponent patient={this.props.patient} />
                <PatientInformationComponent patient={this.props.patient} />
            </div>
        );
    }
}