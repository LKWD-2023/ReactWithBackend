import React from 'react';
import PersonRow from './PersonRow';
import axios from 'axios';
import AddPersonForm from './AddPersonForm';


class PeopleTable extends React.Component {
    state = {
        people: [],
        person: {
            firstName: '',
            lastName: '',
            age: ''
        },
        isLoading: true,
        isAdding: false,
        isTableHidden: false
    }

    getAllPeople = () => {
        axios.get('/api/people/getall').then(res => {
            this.setState({ people: res.data, isLoading: false });
        });
    }

    componentDidMount = () => {
        this.getAllPeople();
    }

    onTextChange = e => {
        const copy = { ...this.state.person };
        copy[e.target.name] = e.target.value;
        this.setState({ person: copy });
    }

    onAddClick = () => {
        this.setState({ isLoading: true, isAdding: true });
        axios.post('/api/people/add', this.state.person).then(() => {
            this.getAllPeople();
            this.setState({
                isAdding: false,
                person: {
                    firstName: '',
                    lastName: '',
                    age: ''
                }
            });
        });
    }

    generateTable = () => {
        const { isLoading, people } = this.state;
        if (isLoading) {
            return <h1>Loading...</h1>
        }

        return people.map(p => <PersonRow key={p.id} person={p} />)
    }


    onHideTableCheckClick = () => {
        this.setState({ isTableHidden: !this.state.isTableHidden });
    }

    render() {
        const { isAdding, isTableHidden } = this.state;
        const { firstName, lastName, age } = this.state.person;
        return <>
            <div className='container mt-5'>
                <div className='row'>
                    <AddPersonForm
                        firstName={firstName}
                        lastName={lastName}
                        age={age}
                        onTextChange={this.onTextChange}
                        onAddClick={this.onAddClick}
                        isAdding={isAdding}
                    />
                </div>
                <div className='row mt-5'>
                    <div className='col-md-2'>
                        <div className="form-check">
                            <input className="form-check-input"
                                style={{ transform: "scale(1.5)" }}
                                type="checkbox"
                                checked={isTableHidden}
                                onChange={this.onHideTableCheckClick}
                            />
                            <label className="form-check-label" >
                                Hide Table
                            </label>
                        </div>
                    </div>
                    <div className='col-md-2'>
                        <button disabled={!isTableHidden} className='btn btn-primary w-100' onClick={() => this.setState({isTableHidden: false})}>Show Table</button>
                    </div>
                    <div className='col-md-2'>
                        <button disabled={isTableHidden} className='btn btn-danger w-100' onClick={() => this.setState({isTableHidden: true})}>Hide Table</button>
                    </div>
                </div>
                {!isTableHidden && <div className='row'>
                    <table className='table table-hover table-striped table-bordered mt-3'>
                        <thead>
                            <tr>
                                <td>First Name</td>
                                <td>Last Name</td>
                                <td>Age</td>
                            </tr>
                        </thead>

                        <tbody>
                            {this.generateTable()}
                        </tbody>

                    </table>
                </div>
                }
            </div>

        </>
    }
}

export default PeopleTable;