import React from 'react';
import ReactSVG from 'react-svg';

import hub from '../../assets/168 Hub.svg';
import pill from '../../assets/183 Pill.svg';
import upload from '../../assets/065 Upload.svg';

export default class QuickLinksComponent extends React.Component {
    render() {
        return (
            <div className="QuickLinksComponent">
                <div className="title"><p>Quick Links</p></div>                
                <div className="quicklink">
                    <ReactSVG path={hub} className='icon' />
                    <div className="quicklinkText"><span className="bLink">View Study Details</span> in Resources</div>
                </div>
                <div className="quicklink">
                    <ReactSVG path={upload} className='icon' />
                    <div className="quicklinkText"><span className="bLink">Upload your Medical Records</span> in Resources</div>
                </div>
                <div className="quicklink">
                    <ReactSVG path={pill} className='icon' />
                    <div className="quicklinkText"><span className="bLink">Request Replacement Medication</span> for lost or damaged study medication</div>
                </div>
            </div>
        );
    }
}