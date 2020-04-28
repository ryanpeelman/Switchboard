import React from 'react';
import ReactSVG from 'react-svg';
import ReactTable from 'react-table';
import moment from 'moment';

import alert from '../../assets/003 Warning.svg';
import warning from '../../assets/301 Warning.svg';

import POCHelperService from '../../services/POCHelperService';

export default class TaskListTable extends React.Component {
	constructor() {
		super();

		this.patientColumns = [
			{ Header: 'Name', accessor: 'name', Cell: row => this.renderNameCellAsLink(row.value) },
			{ Header: 'Due Date', accessor: 'duedate' }
		];

		this.patientGuideColumns = [
			{ Header: 'Name', accessor: 'name', Cell: row => this.renderNameCellAsPatientLink(row, row.value) },
			{ Header: 'Study', accessor: 'study', Cell: row => this.renderStudy(row.value) },
			{ Header: 'Category', accessor: 'category', minWidth: 125 },
			{ Header: 'Due Date', accessor: 'duedate', Cell: row => this.renderDueDateCell(row.value) },
			{ Header: '', accessor: 'duedate', width: 50, Cell: row => this.renderWarningCell(row.value) }
		];

		this.renderDueDateCell = this.renderDueDateCell.bind(this);
		this.renderNameCellAsLink = this.renderNameCellAsLink.bind(this);
		this.renderNameCellAsPatientLink = this.renderNameCellAsPatientLink.bind(this);
		this.renderStudy = this.renderStudy.bind(this);
		this.renderWarningCell = this.renderWarningCell.bind(this);

		this.knownPatientNames = POCHelperService.getKnownPatientNames();

		this.DATE_FORMAT = "DD-MMM-YYYY";
	}

	renderDueDateCell(value) {
		var dueDate = moment(value, this.DATE_FORMAT);
		var isOverDue = moment().startOf('day').isAfter(dueDate);
		if (isOverDue) {
			return <div className="alert">{value}</div>;
		}

		var isToday = dueDate.isSame(moment(), 'day');
		if (isToday) {
			return <div className="warning">{value}</div>;
		}

		return <div>{value}</div>
	}

	renderNameCellAsLink(value) {
		return <div class="bLink">{value}</div>;
	}

	renderNameCellAsPatientLink(row, value) {
		const handlePatientNameClick = e => {
			if (e.target.className === "bLink") {
				const relatedPatientId = row.original.relatedPatientId;
				if (relatedPatientId && this.props.launchDrilldown) {
					this.props.launchDrilldown(relatedPatientId);
				}
			}
		}

		var linkedPatientElementHtml = value;
		this.knownPatientNames.forEach(patientName => {
			linkedPatientElementHtml = linkedPatientElementHtml.replace(patientName, '<div class="bLink">' + patientName + '</div>');
		});
		return <div onClick={e => handlePatientNameClick(e)} dangerouslySetInnerHTML={{ __html: linkedPatientElementHtml }}></div>;
	}

	renderStudy(value) {
		return <div className="bLink">{value}</div>;
	}

	renderWarningCell(value) {
		var dueDate = moment(value, this.DATE_FORMAT);
		var isOverDue = moment().startOf('day').isAfter(dueDate);
		if (isOverDue) {
			return <div className="alert"><ReactSVG path={alert} className='icon' /></div>;
		}

		var isToday = dueDate.isSame(moment(), 'day');
		if (isToday) {
			return <div className="warning"><ReactSVG path={warning} className='icon' /></div>;
		}

		return <div></div>
	}

	render() {
		if (!this.props.tasks) {
			return (<div><p>No Tasks Here!</p></div>);
		}

		const tableTypeClass = this.props.user.isPatientGuide ? "PatientGuide" : "Patient";
		const columns = this.props.user.isPatientGuide ? this.patientGuideColumns : this.patientColumns;
		const data = this.props.tasks;

		return (
			<ReactTable data={data} columns={columns} defaultPageSize={6} showPagination={false} className={tableTypeClass} />
		);
	}
}