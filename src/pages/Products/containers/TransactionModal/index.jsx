import moment from 'moment';
import { values, isEmpty } from 'lodash';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { DateRangePicker } from 'react-dates';
import { HalfCircleSpinner, SemipolarSpinner } from 'react-epic-spinners';

import 'react-dates/initialize';

import 'react-dates/lib/css/_datepicker.css';

import { convertArrayOfObjectsToCSV } from '../../../../utils/csvConverter';

import { setTransactions, fetchTransactions } from '../../../../store/actions';

import Modal from '../../../../components/Modal/index.jsx';

import HttpService from '../../../../services/HttpService';

const httpService = new HttpService();

class TransactionModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            endDate: moment(),
            focusedInput: 'startDate',
            startDate: moment().subtract(7, 'days')
        };

        [
            'export',
            'submit',
            'closeModal',
            'dateChangeHandler',
            'focusedInputChangeHandler'
        ].map(fn => (this[fn] = this[fn].bind(this)));
    }

    async componentDidMount() {
        let { endDate, startDate } = this.state;
        let { fetchTransactions } = this.props;

        try {
            let result = await httpService.getData('transactions', {
                endDate: endDate.format('YYYY-MM-DD'),
                startDate: startDate.format('YYYY-MM-DD')
            });

            fetchTransactions(result.list);
        } catch (error) {
            console.log('error: ', error);
            alertify.error('Oops, something went wrong.');
        }
    }

    dateChangeHandler(value) {
        this.setState({
            endDate: value.endDate,
            startDate: value.startDate
        });
    }

    focusedInputChangeHandler(focusedInput) {
        this.setState({ focusedInput });
    }

    closeModal() {
        this.props.setTransactions({ data: {} });
    }

    getColumns() {
        let columns = [
            {
                Header: 'Action',
                accessor: 'TransactionType',
                Cell: props => (
                    <div className="text-center">
                        {props.value === 'ADD'
                            ? 'Added Stocks'
                            : props.value === 'SUBTRACT'
                                ? 'Subtracted Stocks'
                                : ''}
                    </div>
                ),
                filterMethod: (filter, row) => {
                    if (filter.value === 'all') {
                        return row;
                    }

                    return row[filter.id] === filter.value ? row : '';
                },
                Filter: ({ filter, onChange }) => {
                    return (
                        <select
                            onChange={e => onChange(e.target.value)}
                            style={{ width: '100%' }}
                            value={
                                typeof filter !== 'undefined'
                                    ? filter.value
                                    : 'all'
                            }
                        >
                            <option value="all">All</option>
                            <option value="ADD">Add</option>
                            <option value="SUBTRACT">Subtract</option>
                        </select>
                    );
                }
            },
            {
                Header: 'Original Quantity',
                accessor: 'OriginalQuantity',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Quantity',
                accessor: 'Quantity',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'New Quantity',
                accessor: 'NewQuantity',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Product',
                id: 'Name',
                accessor: d => !isEmpty(d.Product) ? d.Product.Description : '',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Total Price',
                accessor: 'TotalPrice',
                Cell: props => (
                    <div className="text-center">{props.value.toFixed(2)}</div>
                )
            },
            {
                Header: 'Date',
                accessor: 'CreatedAt',
                Cell: props => (
                    <div className="text-center">
                        {moment(props.value).format('MMMM Do YYYY, h:mm a')}
                    </div>
                )
            }
        ];

        return columns;
    }

    export() {
        let rowData = [];
        let filteredData = this.reactTable.getResolvedState().sortedData;

        filteredData.map(data => {
            let dataObj = {};

            dataObj['Action'] = data.TransactionType;
            dataObj['Original Quantity'] = data.OriginalQuantity;
            dataObj['Quantity'] = data.Quantity;
            dataObj['New Quantity'] = data.NewQuantity;
            dataObj['Product Name'] = data.Name;
            dataObj['Total Price'] = data.TotalPrice;
            dataObj['Date'] = moment(data._original.CreatedAt).format(
                'MMMM Do YYYY'
            );

            rowData.push(dataObj);
        });

        let data, filename, link;
        let csv = convertArrayOfObjectsToCSV({ data: rowData });

        if (!csv) {
            return false;
        }

        filename = `${+new Date()}.csv`;

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    async submit() {
        let { endDate, startDate } = this.state;
        let { setTransactions, fetchTransactions } = this.props;

        setTransactions({ fetchLoading: true });

        try {
            let result = await httpService.getData('transactions', {
                endDate: endDate.format('YYYY-MM-DD'),
                startDate: startDate.format('YYYY-MM-DD')
            });

            setTransactions({ fetchLoading: false });
            fetchTransactions(result.list);

            alertify.success(result.message);
        } catch (error) {
            console.log('error: ', error);
            alertify.error('Oops, something went wrong.');
        }
    }

    render() {
        let columns = this.getColumns();

        let { data, fetchLoading } = this.props;
        let { endDate, focusedInput, startDate } = this.state;

        return (
            <Modal
                formId="transaction-form"
                modalId="transactions-modal"
                closeModal={this.closeModal}
                modalTitle="View Transactions"
            >
                <div className="modal-body">
                    <div className="row">
                        <div className="col-md-8 col-sm-8 col-xs-8">
                            <DateRangePicker
                                minimumNights={0}
                                endDate={endDate}
                                endDateId="EndDate"
                                startDate={startDate}
                                startDateId="StartDate"
                                isOutsideRange={() => {}}
                                showDefaultInputIcon={true}
                                focusedInput={focusedInput}
                                onDatesChange={this.dateChangeHandler}
                                onFocusChange={this.focusedInputChangeHandler}
                            />
                            &nbsp; &nbsp;
                            <button
                                type="button"
                                onClick={this.submit}
                                className="btn btn-default btn-round"
                            >
                                GO
                            </button>
                        </div>
                        <div className="col-md-4 col-sm-4 col-xs-4 d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-primary btn-round"
                                onClick={this.export}
                            >
                                <i className="now-ui-icons arrows-1_cloud-download-93" />{' '}
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <ReactTable
                                filterable
                                data={data}
                                columns={columns}
                                defaultPageSize={10}
                                loading={fetchLoading}
                                ref={r => (this.reactTable = r)}
                                loadingText={
                                    <div style={{ display: 'inline-block' }}>
                                        <SemipolarSpinner
                                            color="black"
                                            size={100}
                                        />
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer d-flex justify-content-start">
                    <button
                        type="button"
                        data-dismiss="modal"
                        onClick={this.closeModal}
                        className="btn btn-default btn-round"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        data: values(state.transactions.data),
        fetchLoading: state.transactions.fetchLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setTransactions: data => dispatch(setTransactions(data)),
        fetchTransactions: data => dispatch(fetchTransactions(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionModal);
