import React from 'react';
import ReactSVG from 'react-svg';

import video from '../../assets/270 Video Camera.svg';

export default class StartSessionComponent extends React.Component {
    render() {
        if (!this.props.drilldownPatient) {
            return null;
        }

        const televisitTitle = "Ad-Hoc Televisit Session"
        return (
            <div className="StartSessionComponent">
                <div className="startVideo" onClick={() => this.props.createSession(this.props.drilldownPatient.uid, televisitTitle)}>
                    <ReactSVG path={video} className='video' />
                    <div>Start video</div>
                </div>
            </div>
        );
    }
}