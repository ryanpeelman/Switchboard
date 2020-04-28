import React from 'react';
import ReactSVG from 'react-svg';

import ResourcesDropdownPanel from './ResourcesDropdownPanel';

import downArrow from '../../../assets/050 Chevron Down.svg';


export default class PageNavigatorItem extends React.Component {
	constructor() {
		super();

		this.toggleDropdown = this.toggleDropdown.bind(this);

		this.state = {
			showDropdown: false
		}
	}

	toggleDropdown() {
		if (!this.props.page.hasDropdown) {
			return;
		}

		//TODO: handle other dropdown types besides Resources
		this.setState({ showDropdown: !this.state.showDropdown });
	}

	render() {
		const page = this.props.page;
		const isSelected = (page.name === 'Home');
		const hasDropdown = page.hasDropdown && (page.hasDropdown === true);
		
		const navClassName = "page" + (isSelected ? " selected" : "") + (this.state.showDropdown ? " showDropdown" : "");

		return (
			<div className={navClassName} onClick={() => this.toggleDropdown()}>
				<div>
					{page.name}
				</div>
				{
					hasDropdown &&
					<div >
						<ReactSVG path={downArrow} className='downArrow' />
					</div>
				}
				{
					this.state.showDropdown &&
						<ResourcesDropdownPanel />
				}
			</div>
		);
	}
}