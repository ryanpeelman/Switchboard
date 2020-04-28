import React from 'react';

export default class StudyTeamComponent extends React.Component {
    render() {
        const team = this.props.team;

        const teamMemberItemGenerator = (member, index) =>
            <div key={`item-${index}`}>
                <img src={member.profileImage} className='patientPic' alt={member.displayName} />
                <label>{member.displayName}</label>
                <div>{member.role}</div>
            </div>;

        return (
            <div className="StudyTeamComponent">
                <div className="title">Study Team</div>
                <div className="primary">
                    <span>Primary</span>
                    {team.primary.map(teamMemberItemGenerator)}
                </div>
                <div className="backup">
                    <span>Back-up</span>
                    {team.backup.map(teamMemberItemGenerator)}
                </div>
            </div>
        );
    }
}