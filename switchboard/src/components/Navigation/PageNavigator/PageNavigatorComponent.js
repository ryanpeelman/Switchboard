import React from 'react';

import POCHelperService from '../../../services/POCHelperService';

import PageNavigatorItem from './PageNavigatorItem';

export default class PageNavigatorComponent extends React.Component {
	render() {
		const pages = POCHelperService.getApplicationPages(this.props.user);
		const pageNavigatorItems = pages.map((page, index) =>
			<PageNavigatorItem key={`item-${index}`} page={page} />
		);

		return (
			<div className="PageNavigatorComponent">
				{pageNavigatorItems}
			</div>
		);
	}
}