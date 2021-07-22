import { Component } from 'react';
import '../App.css';
import Search from './Search';
import Sort from './Sort';

class Control extends Component {
    render() {
        return (
            <div className="row mt-15">
                {/* Seach */}
                <Search onSearch={this.props.onSearch} />
                {/* Sort  */}
                <Sort
                    onSort={this.props.onSort}
                    sortBy={this.props.sortBy}
                    sortValue={this.props.sortValue}
                />
            </div>
        );
    }
}
export default Control;
