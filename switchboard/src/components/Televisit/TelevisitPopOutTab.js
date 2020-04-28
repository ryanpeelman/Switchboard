import React from 'react';
import ReactSVG from 'react-svg';

import left from '../../assets/051 Chevron Left.svg';
import video from '../../assets/270 Video Camera.svg';

import TelevisitService from '../../services/TelevisitService';

export default class TelevisitPopOutTab extends React.Component {
    constructor() {
        super();

        this.televisitService = TelevisitService.getInstance();
    }

    handleTelevisitClicked = () => {
        this.televisitService.joinSession(this.props.user.uid);
    }

    render() {
        return (
            <div className="TelevisitPopOutTab">
                {!this.props.isExpanded && <button onClick={this.handleTelevisitClicked}><ReactSVG path={video} className='video' /></button>}
                {this.props.isExpanded && <button><ReactSVG path={left} className='arrow' /></button>}
            </div>
        );
    }
}