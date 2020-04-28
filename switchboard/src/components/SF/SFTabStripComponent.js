import React from 'react';
import ReactSVG from 'react-svg';

import apps from '../../assets/apps.svg';
import barGraph from '../../assets/041 Bar Graph.svg';
import close from '../../assets/close.svg';
import documentChecked from '../../assets/250 Document Check.svg';
import downArrow from '../../assets/chevrondown.svg';
import folderWarning from '../../assets/112 Warning Folder.svg';
import home from '../../assets/home.svg';
import hub from '../../assets/168 Hub.svg';
import record from '../../assets/case.svg';

export default class SFTabStripComponent extends React.Component {
	constructor() {
		super();

		this.state = {
			tabs: [
				{ title: "Menu", closeable: false, active: false },
				{ title: "All Studies", icon: hub, closeable: false, active: true }
			],
			pages: [
				{ title: "Home", icon: home, active: true },
				{ title: "Site Ops Metrics", icon: barGraph, active: false },
				{ title: "Protocol Deviations", icon: folderWarning, active: false },
				{ title: "Action Items", icon: documentChecked, active: false }
			],
			showPages: true
		};

		this.close = this.close.bind(this);
		this.popPatientTab = this.popPatientTab.bind(this);
		this.pushPatientTab = this.pushPatientTab.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.drilldownPatient !== this.props.drilldownPatient) {
			if (nextProps.drilldownPatient) {
				this.pushPatientTab(nextProps.drilldownPatient);
			}
			else {
				this.popPatientTab();
			}
		}
	}

	close() {
		this.popPatientTab();

		this.props.setDrilldownPatient(null);
	}

	getPageClass = (page) => {
		return page.active ? "page active" : "page";
	}

	getTabClass = (tab, index) => {
		return tab.active ? (index > 1 ? "tab active patient" : "tab active") : "tab";
	}

	popPatientTab() {
		const tabs = this.state.tabs.slice(0, 2);
		tabs[1].active = true;
		this.setState({ tabs: tabs, showPages: true });
	}

	pushPatientTab(patient) {
		const tabs = this.state.tabs;
		tabs.push({ title: patient.displayName, icon: record, closeable: true, active: true });
		tabs[1].active = false;
		this.setState({ tabs: tabs, showPages: false });
	}

	render() {
		const tabs = this.state.tabs.map((tab, index) =>
			<div key={`item-${index}`} className={this.getTabClass(tab, index)}>
				{tab.icon ? <ReactSVG path={tab.icon} className="icon" alt={tab.title} /> : <div className="icon"></div>}
				<span className="title">{tab.title}</span>
				{!tab.closeable && <div className="bLink"><ReactSVG path={downArrow} className='downArrow' /></div>}
				{tab.closeable && <div className="bLink" onClick={this.close}><ReactSVG path={close} className='close' /></div>}
			</div>
		);

		const pages = this.state.pages.map((page, index) =>
			<div key={`item-${index}`} className={this.getPageClass(page)}>
				<ReactSVG path={page.icon} className="icon" alt={page.title} />
				<span className="title">{page.title}</span>
				<div className="bLink"><ReactSVG path={close} className='close' /></div>
			</div>
		);

		return (
			<div className="SFTabStripComponent">
				<div className="top">
					<div className="header">
						<ReactSVG path={apps} className='apps' alt="IQVIA apps" />
						<span>Study Hub</span>
					</div>
					<div className="tabs">
						{tabs}
					</div>
				</div>
				{
					this.state.showPages &&
					<div className="bottom">
						<div className="pages">
							{pages}
						</div>

					</div>
				}
			</div>
		);
	}
}