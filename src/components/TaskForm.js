import { Component } from 'react';
import '../App.css';
class TaskForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            status: false,
        }
    }

    componentDidMount() {
        //console.log('componentDidMount');
        if (this.props.task) {
            this.setState({
                id: this.props.task.id,
                name: this.props.task.name,
                status: this.props.task.status,
            });
            //console.log(this.state);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        if (nextProps && nextProps.task) {
            this.setState({
                id: nextProps.task.id,
                name: nextProps.task.name,
                status: nextProps.task.status,
            });
            //console.log(this.state);
        } else if (!nextProps.task) {
            //console.log('sua -> them');
            this.setState({
                id: '',
                name: '',
                status: false,
            })
        }
    }

    onCloseForm2 = () => {
        this.props.onCloseForm();
    }

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        if (name === 'status') {
            value = target.value === 'true' ? true : false;
        }
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        //console.log(this.state);
        //this.props.onSubmit(this.state.name, this.state.status === 'true' ? true : false);
        this.props.onSubmit(this.state);
        //Cancel && Close Form
        this.onClear();
        this.onCloseForm2();
    }

    onClear = () => {
        this.setState({
            name: '',
            status: false,
        });
    }

    render() {
        var { id } = this.state;
        return (
            <div className="panel panel-warning">
                <div className="panel-heading">
                    <h3 className="panel-title">{id !== '' ? 'S???a C??ng Vi???c' : 'Th??m C??ng Vi???c'}
                        <span className="fa fa-times-circle-o text-right " onClick={this.onCloseForm2}></span>
                    </h3>
                </div>
                <div className="panel-body">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>T??n :</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={this.state.name}
                                onChange={this.onChange}
                            />
                        </div>
                        <label>Tr???ng Th??i :</label>
                        <select
                            className="form-control"
                            required="required"
                            name="status"
                            value={this.state.status}
                            onChange={this.onChange}
                        >
                            <option value={true}>K??ch Ho???t</option>
                            <option value={false}>???n</option>
                        </select>
                        <br />
                        <div className="btn-right">
                            <button type="submit" className="btn btn-warning">L??u l???i</button>&nbsp;
                            <button type="button" className="btn btn-danger" onClick={this.onClear}>H???y B???</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
export default TaskForm;
