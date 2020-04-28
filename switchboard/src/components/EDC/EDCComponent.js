import React from 'react';
import ReactSVG from 'react-svg';

import moveUpRight from '../../assets/208 Move Up Right.svg';

export default class EDCComponent extends React.Component {
    constructor() {
        super();

        this.studies = [
            {
                name: "ALZVS369", 
                openQueries: 4, 
                incompleteForms: 1
            }, 
            {
                name: "SGSTK879", 
                openQueries: 2, 
                incompleteForms: 5
            }
        ]
    }
    render() {
        const studyEDCItemGenerator = (study, index) =>
            <div key={`item-${index}`}>
                <div className="study">Study: {study.name} <ReactSVG path={moveUpRight} className='icon' /></div>
                <div className="data">
                    <div className="count">{study.openQueries}</div>
                    <div className="name">open queries</div>
                </div>
                <div className="data">
                    <div className="count">{study.incompleteForms}</div>
                    <div className="name">incomplete forms</div>
                </div>
            </div>;

        return (
            <div className="EDCComponent">
                <div className="title">
                    EDC/eSource
                </div>
                <div className="studies">
                    {this.studies.map(studyEDCItemGenerator)}
                </div>
            </div>
        );
    }
}