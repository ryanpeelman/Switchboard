import React from 'react';

import POCHelperService from '../../services/POCHelperService';

export default class TaskListCategoryStripComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            selectedCategoryNames: []
        };

        this.taskCategories = POCHelperService.getTaskCategories();
    }

    getCategoryItemClass = (category) => {
        const selected = this.isSelectedCategory(category);
        return (selected) ? "categoryItem selected" : "categoryItem";
    }

    getCountClass = (category) => {
        const clickable = this.isClickableCategory(category);
        return (clickable) ? "count clickable" : "count";
    }

    getCountForCategory = (category) => {
        const itemsForCategory = this.props.allTasks.filter(task => task.category === category);
        return itemsForCategory.length;
    }

    handleCategoryClick(category) {
        var selectedCategoryNames = this.state.selectedCategoryNames;
        if (selectedCategoryNames.includes(category)) {
            selectedCategoryNames = selectedCategoryNames.filter(x => x !== category);
        }
        else {
            selectedCategoryNames.push(category);
        }

        this.setState({ selectedCategoryNames: selectedCategoryNames });

        if(this.props.updateSelectedCategoryNames) {
            this.props.updateSelectedCategoryNames(selectedCategoryNames);
        }
    }

    isClickableCategory(category) {
        return this.getCountForCategory(category) > 0;
    }

    isSelectedCategory(category) {
        return this.state.selectedCategoryNames.includes(category);
    }

    render() {
        if (!this.props.tasks) {
            return null;
        }

        const categoryItems = this.taskCategories.map((category, index) =>
            <div className={this.getCategoryItemClass(category)} key={`item-${index}`} onClick={() => this.handleCategoryClick(category)}>
                <span className={this.getCountClass(category)}>{this.getCountForCategory(category)}</span>
                <span className="name">{category}</span>
            </div>
        );

        return (
            <div className="TaskListCategoryStripComponent">
                {categoryItems}
            </div>
        );
    }
}
