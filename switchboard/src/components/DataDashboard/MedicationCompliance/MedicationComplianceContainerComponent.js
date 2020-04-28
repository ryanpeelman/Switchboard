import React from 'react';
import ReactSVG from 'react-svg';
import moment from 'moment';

import check from '../../../assets/049 Check.svg';
import close from '../../../assets/062 Close.svg';
import downArrow from '../../../assets/050 Chevron Down.svg';
import leftArrow from '../../../assets/051 Chevron Left.svg';
import rightArrow from '../../../assets/052 Chevron Right.svg';

import POCHelperService from '../../../services/POCHelperService';

export default class MedicationComplianceContainerComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            isComponentExpanded: true
        }

        this.toggleContent = this.toggleContent.bind(this);
    }

    getClassAdditives = (value, date, meridiem) => {
        const isDateToday = moment(date).isSame(moment(), 'day');
        if (isDateToday) {
            const isSameMeridiem = meridiem === moment().format("A");
            if (isSameMeridiem) {
                return (value !== 0) ? " active" : " pending";
            }
        }

        const isDateFuture = moment(date, "DD-MMM").add((meridiem === "PM") ? 12 : 0, 'hours').isAfter(moment());
        if (isDateFuture) {
            return "";
        }

        return (value !== 0) ? " pass" : " fail";
    }

    getContent = (value) => {
        return (value !== 0) ? <ReactSVG path={check} className='icon check' /> : <ReactSVG path={close} className='icon close' />;
    }

    markAsTaken = (date, meridiem) => {
        POCHelperService.updatePillCompliance(this.props.uid, date, meridiem);
    }

    toggleContent() {
        this.setState({ isComponentExpanded: !this.state.isComponentExpanded });
    }

    render() {
        //We're going to show the last six days plus tomorrow.  Since we get the last seven days of data, splice the oldest record off.
        const dailyEvents = this.getDailyEvents(this.props.eventData);
        const dailyEventsArray = Object.keys(dailyEvents).map(key => ({ key, value: dailyEvents[key] })).reverse().splice(1);

        const dosageSummary = "Takes one pill, twice daily";
        const total = (dailyEventsArray.length * 2);
        const taken = dailyEventsArray.filter(x => x.value.amValue !== 0).length + dailyEventsArray.filter(x => x.value.pmValue !== 0).length;
        const nottaken = total - taken;
        const medicationComplianceSummary = "Weekly Summary - " + taken + " taken / " + nottaken + " not taken";
        const percentage = (total && total > 0) ? Math.round((taken / total) * 100) : 0;

        //Add tomorrow to the data, but do it after the summary calculations to not skew those results.
        const tomorrow = moment().add(1, 'day').startOf('day');
        const date = tomorrow.format("DD-MMM");
        dailyEventsArray.push({ date, value: { eventDateTime: date, date: date, amValue: 0, pmValue: 0 } });

        const pillItems = dailyEventsArray.map((dailyEvent, index) =>
            <div key={`item-${index}`} className='pillItemEvent'>
                <div className="pillDate">{dailyEvent.value.date}</div>

                <div className="boxesContainer">
                    <div className={"am" + this.getClassAdditives(dailyEvent.value.amValue, dailyEvent.value.eventDateTime, "AM")}
                        onClick={() => this.markAsTaken(dailyEvent.value.eventDateTime, "AM")}>{this.getContent(dailyEvent.value.amValue)}</div>
                    <div className={"pm" + this.getClassAdditives(dailyEvent.value.pmValue, dailyEvent.value.eventDateTime, "PM")}
                        onClick={() => this.markAsTaken(dailyEvent.value.eventDateTime, "PM")}>{this.getContent(dailyEvent.value.pmValue)}</div>
                </div>
            </div>
        );

        return (
            <div className="PillComplianceContainer">
                <div className="header" onClick={this.toggleContent}>
                    <div>
                        {this.state.isComponentExpanded && <ReactSVG path={downArrow} className='downArrow' />}
                        {!this.state.isComponentExpanded && <ReactSVG path={rightArrow} className='rightArrow' />}
                        MEDICATION COMPLIANCE
                    </div>
                    <div>{medicationComplianceSummary}</div>
                    <div>{dosageSummary}</div>
                </div>
                {
                    this.state.isComponentExpanded &&
                    <div className="container">
                        <div className="sideSummary">
                            <div className="text">
                                <div className="percentage">{percentage}%</div>
                                medication taken
                            </div>
                        </div>
                        <div className="pillMarkers">
                            <ReactSVG path={leftArrow} className='arrow' />
                            <div className="pillGrid">
                                <div className="pillItemEvent rowheader">
                                    <div className="pillDate rowheader">.</div>
                                    <div className="boxesContainer rowheader">
                                        <div className="am rowheader"><div>AM</div></div>
                                        <div className="pm rowheader"><div>PM</div></div>
                                    </div>
                                </div>
                                {pillItems}
                            </div>
                            <ReactSVG path={rightArrow} className='arrow' />
                        </div>
                    </div>
                }
            </div>
        );
    }

    getDailyEvents(events) {
        var dailyEvents = {};

        for (var eventKey in events) {
            var event = events[eventKey];
            var eventDateTime = event.eventDateTime;
            var date = moment(eventDateTime).format("DD-MMM");

            if (!dailyEvents.hasOwnProperty(date)) {
                var dailyEvent = { eventDateTime: eventDateTime, date: date, amValue: 0, pmValue: 0 };
                dailyEvents[date] = dailyEvent;
            }

            var value = event.pilltaken;
            var meridiem = moment(eventDateTime).format("A");
            if (meridiem === "AM") {
                dailyEvents[date].amValue = value;
            }
            else {
                dailyEvents[date].pmValue = value;
            }
        }

        return dailyEvents;
    }
}