import React from 'react';
import ReactSVG from 'react-svg';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

import mic from '../../assets/163 Microphone.svg';
import phone from '../../assets/182 Phone.svg';

export default class VideoSessionComponent extends React.Component {

    constructor() {
        super();

        this.state = {
            publisherProperties: {
                disableAudioProcessing: true,
                showControls: false,
                publishAudio: false     //start muted
            },
            subscriberProperties: {
                disableAudioProcessing: true,
                showControls: false
            },
            subscriberEventHandlers: {
                videoElementCreated: event => {
                    //resize the publisher window as PIP
                    var publisher = document.getElementsByClassName('OTPublisherContainer')[0];
                    if (publisher) {
                        publisher.classList.add('showPip');
                    }

                    this.doResize(null)

                    //alert parent
                    if (this.props.setPatientOnline) {
                        this.props.setPatientOnline(true);
                    }
                },
                destroyed: event => {
                    //restore publisher window as full size
                    var publisher = document.getElementsByClassName('OTPublisherContainer')[0];
                    if (publisher) {
                        publisher.classList.remove('showPip');
                    }

                    this.doResize();

                    //alert parent
                    if (this.props.setPatientOnline) {
                        this.props.setPatientOnline(false);
                    }
                }
            }
		};
		
		this.doResize = this.doResize.bind(this);
    }

	componentDidMount() {
		this.doResize();

		//handle resize event
		window.addEventListener("resize", this.doResize);
	}
	
	componentWillUnmount() {
		window.removeEventListener("resize", this.doResize);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		//if component is made fullscreen or not, force a resize
		if (prevProps.isTelevisitFullScreen !== this.props.isTelevisitFullScreen) {
			this.doResize();
		}

		//TODO: deal with minimized?
	}

    doResize() {
		var theDiv; //the div that will be used as the bounds for this video

		if (this.props.isPatientGuide) {
			//Use reference to the parent tab container. Use this rather than the videoSession div because when we tab away from the Televisit tab
			//  (and select Call Details or Patient Summary) the videoSession div dimensions are no longer valid
			theDiv = document.getElementsByClassName('TelevisitTabContainerComponent')[0].getElementsByClassName('react-tabs__tab-panel react-tabs__tab-panel--selected')[0];
		}
		else {
			theDiv = document.getElementsByClassName('videoSession')[0];
		}

		//get reference to videoSession div
        if (!theDiv || (theDiv == null)) {
            //can happen if video session is closed (TODO: is this still possible?)
            return;
        }

        //get largest rectangle that supports the 4:3 aspect ratio
        const aspectRatio = 4 / 3;
        const screenPercent = 1.0;                          //video will fill this percentage of the div
        var width, height;

		//our boundaries are the width of the videosession div and the height from the top of the videosession div to the bottom of the browser window
		const boundingWidth = theDiv.clientWidth;
		var boundingHeight;
		if (this.props.isPatientGuide) {
			if (this.props.isTelevisitFullScreen) {
				boundingHeight = window.innerHeight - 270;
			}
			else {
				//side panel div has already established its size, so conform to that
				boundingHeight = theDiv.clientHeight;
			}
		}
		else {
			boundingHeight = window.innerHeight - (this.props.isTelevisitFullScreen ? 122 : 172);
		}

		if (aspectRatio < (boundingWidth / boundingHeight)) {
			//bounding area is too wide; limit our target area by height
            height = boundingHeight * screenPercent;
            width = height * aspectRatio;
        }
        else {
			//bounding area is too tall; limit our target area by width
            width = boundingWidth * screenPercent;
            height = width / aspectRatio;
        }

		const left = (0 < (boundingWidth-width)/2) ? (boundingWidth-width)/2 : 0;	//center horizontally
		const top = 0;																//used fixed offset from top

        const defaultWidth = 600;
        const defaultHeight = 450;        
        width = (width === 0) ? defaultWidth : width;
        height = (height === 0) ? defaultHeight : height;

		//set the video component position to this bounding rectangle
        const subDiv = document.getElementsByClassName('OTSubscriberContainer')[0];
        if (subDiv) {
            subDiv.style.width = Math.round(width) + 'px';
            subDiv.style.height = Math.round(height) + 'px';
            subDiv.style.left = Math.round(left) + 'px';
            subDiv.style.top = Math.round(top) + 'px';
        }

        var pubDiv = document.getElementsByClassName('OTPublisherContainer')[0];
        if (pubDiv) {
            if (pubDiv.classList.contains('showPip')) {
                const pipOffset = 20;
                pubDiv.style.width = Math.round(width / 4) + 'px';
				pubDiv.style.height = Math.round(height / 4) + 'px';
				pubDiv.style.left = (Math.round(left + (width * 3 / 4)) - 2 - pipOffset) + 'px';
                pubDiv.style.top = (Math.round(top) + pipOffset) + 'px';
            }
            else {
                pubDiv.style.width = Math.round(width) + 'px';
                pubDiv.style.height = Math.round(height) + 'px';
				pubDiv.style.left = Math.round(left) + 'px';
                pubDiv.style.top = Math.round(top) + 'px';
			}
        }

		//also resize the videoSession div itself so that the video area does not outgrow its surrounding pane
		//(this is also necessary so that the mute/close buttons can be properly positioned)
		const videoDiv = document.getElementsByClassName('videoSession')[0];
		if (videoDiv) {
			videoDiv.style.height = height - 5+ 'px';
		}
    }

    toggleMic() {
        this.setState({
            publisherProperties: {publishAudio: !this.state.publisherProperties.publishAudio}
        });
    }

    render() {
		const viewClass = "videoSession";
        const micIconClass = "iconMic" + (this.state.publisherProperties.publishAudio ? "" : " off");
        return (
            <div className={viewClass}>
                <OTSession
                    apiKey={this.props.apiKey}
                    sessionId={this.props.sessionId}
                    token={this.props.token}>
                    <OTStreams>
                        <OTSubscriber properties={this.state.subscriberProperties} eventHandlers={this.state.subscriberEventHandlers} />
                    </OTStreams>
                    <OTPublisher properties={this.state.publisherProperties} />
                </OTSession>
                <div className="closeSessionContainer">
                    <div className="iconContainer">
                        <div className={micIconClass} onClick={() => this.toggleMic()}>
                            <ReactSVG path={mic} className='mic' />
                        </div>
                        <div className="iconPhone" onClick={() => this.props.closeSession()}>
                            <ReactSVG path={phone} className='phone' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}