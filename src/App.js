import { Component } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import Control from './components/ConTrol';
import TaskList from './components/TaskList';
import { findIndex, filter } from 'lodash';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            missions: [], //id :unique,name,status State 
            isDisplayForm: false,
            taskEditing: null,
            filter: {
                name: '',
                status: -1 // all:-1, active:1, deactive:0
            },
            keyword: '',
            sortBy: 'name',
            sortValue: 1,
        }
        this.onToggleForm = this.onToggleForm.bind(this);
    }

    // Sử dụng componentDidmount để refresh để gắn vào missions
    componentDidMount() {
        if (localStorage && localStorage.getItem('missions')) {
            var mission_change = JSON.parse(localStorage.getItem('missions'));
            this.setState({
                missions: mission_change
            });
        }
    }

    generateID() {
        var randomstring = require("randomstring");
        return randomstring.generate(10);
    }

    onToggleForm() {
        if (this.state.isDisplayForm && this.state.taskEditing !== null) {
            this.setState({
                isDisplayForm: true,
                taskEditing: null
            })
        } else {
            this.setState({
                isDisplayForm: !this.state.isDisplayForm,
                taskEditing: null
            })
        }

    }

    onShowForm = () => {
        this.setState({
            isDisplayForm: true
        });
    }

    onCloseForm = () => {
        //console.log('onCloseForm');
        this.setState({
            isDisplayForm: false,

        });
    }

    onSubmit = (data) => {
        console.log(data);
        var { missions } = this.state;
        if (data.id === '') {
            data.id = this.generateID();
            missions.push(data);
        } else {
            //Edit
            var index = this.findIndex(data.id);
            missions[index] = data;
        }

        this.setState({
            missions: missions,
            taskEditing: null,
        });
        localStorage.setItem('missions', JSON.stringify(missions));
    }

    onUpdateStatus = (id) => {
        // console.log(id);
        var { missions } = this.state;
        // var index = this.findIndex(id);
        var index = findIndex(missions, (task) => {
            return task.id === id;
        });
        console.log(index);
        if (index !== -1) {
            missions[index].status = !missions[index].status;
            this.setState({
                missions: missions
            });
            localStorage.setItem('missions', JSON.stringify(missions));
        }
    }

    findIndex = (id) => {
        var { missions } = this.state;
        var result = -1;
        missions.forEach((missions, index) => {
            if (missions.id === id) {
                result = index;
            }
        });
        return result;
    }

    onDelete = (id) => {
        var { missions } = this.state;
        var index = this.findIndex(id);
        console.log(index);
        if (index !== -1) {
            missions.splice(index, 1);
            this.setState({
                missions: missions
            });
            localStorage.setItem('missions', JSON.stringify(missions));
        }
        this.onCloseForm();
    }

    onUpdate = (id) => {
        //console.log(id);
        //Tim mission
        var { missions } = this.state;
        var index = this.findIndex(id);
        //console.log(index);
        var taskEditing1 = missions[index];
        //console.log(taskEditing1);
        this.setState({
            taskEditing: taskEditing1
        });
        this.onShowForm();
    }

    onFilter = (filterName, filterStatus) => {
        //console.log(filterName, '-', filterStatus);
        //filterStatus = parseInt(filterStatus, 10);
        filterStatus = +filterStatus;
        //console.log(typeof filterStatus);
        this.setState({
            filter: {
                name: filterName.toLowerCase(),
                status: filterStatus,
            }
        });
    }

    onSearch = (keyword) => {
        //console.log(keyword);
        this.setState({
            keyword: keyword
        });
    }

    onSort = (sortBy, sortValue) => {
        //console.log(sortBy, '-', sortValue);
        this.setState({
            sortBy: sortBy,
            sortValue: sortValue,
        });
    }


    render() {

        var { missions, isDisplayForm, taskEditing, keyword, sortBy, sortValue } = this.state; // var tasks = this.state.tasks
        //console.log(filter);
        if (filter) {
            if (filter.name) {
                // missions = missions.filter((task) => {
                //     //console.log(task);
                //     return task.name.toLowerCase().indexOf(filter.name) !== -1;
                // });
                missions = filter(missions, (task) => {
                    return task.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
                });
            }
            // !== null, !== undefined, !== 0
            missions = missions.filter((task) => {
                if (filter.status === -1) {
                    return task;
                } else {
                    return task.status === (filter.status === 1 ? true : false);
                }
            });

        }
        if (keyword) {
            missions = missions.filter((task) => {
                //console.log(task);
                return task.name.toLowerCase().indexOf(keyword) !== -1;
            });
        }
        //console.log(sortBy, '-', sortValue);
        if (sortBy === 'name') {
            missions.sort((a, b) => {
                if (a.name > b.name) return sortValue;//so sanh index cua bang chu so
                else if (a.name < b.name) return -sortValue;
                else return 0;
            })
        } else {
            missions.sort((a, b) => {
                if (a.status > b.status) return -sortValue;// so sanh gia tri cua status
                else if (a.status < b.status) return sortValue;
                else return 0;
            })
        }
        // Kiem tra elmTaskForm neu isDisplayForm bang true thi do ra TaskForm ko thi do ra rong
        var elmTaskForm = isDisplayForm
            ? <TaskForm
                onSubmit={this.onSubmit}
                onCloseForm={this.onCloseForm}
                task={taskEditing}
            /> : '';
        return (
            <div className="container">
                <div className="text-center">
                    <h1>Quản Lý Công Việc</h1>
                    <hr />
                </div>
                <div className="row">
                    <div className={isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
                        {/* TaskForm  */}
                        {elmTaskForm}
                    </div>
                    <div className={isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.onToggleForm}
                        >
                            <span className="fa fa-plus mr-5"></span>Thêm Công Việc
                        </button>
                        {/* Seach-Sort */}
                        <Control
                            onSearch={this.onSearch}
                            onSort={this.onSort}
                            sortBy={sortBy}
                            sortValue={sortValue}
                        />
                        <div className="row mt-15">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                {/* TaskList  */}
                                <TaskList
                                    taskList={missions}
                                    onUpdateStatus={this.onUpdateStatus}
                                    onDelete={this.onDelete}
                                    onUpdate={this.onUpdate}
                                    onFilter={this.onFilter}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default App;