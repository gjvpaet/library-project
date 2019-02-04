import moment from 'moment';
import { values } from 'lodash';
import jparam from 'jquery-param';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { SemipolarSpinner } from 'react-epic-spinners';

import { fetchProducts } from '../../store/actions';

import Card from '../../components/Card/index.jsx';
import Layout from '../../components/Layout/index.jsx';

import HttpService from '../../services/HttpService';

const httpService = new HttpService();

class Archive extends Component {
    componentDidMount() {
        this.getArchives();
    }

    async getArchives() {
        let { fetchProducts } = this.props;

        try {
            let result = await httpService.getAllData(
                'products',
                jparam({ status: 0 })
            );

            result.list = result.list.map(data => {
                data.CreatedDate = moment(data.CreatedAt).format(
                    'MMMM Do, YYYY h:mm a'
                );
                data.UpdatedDate = moment(data.UpdatedAt).format(
                    'MMMM Do, YYYY h:mm a'
                );

                return data;
            });

            fetchProducts(result.list);
        } catch (error) {
            console.log('error: ', error);
        }
    }

    getColumns() {
        return [
            {
                Header: 'Name',
                accessor: 'Name',
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let name = row[filter.id].toLowerCase();

                    return name.includes(value) ? row : '';
                },
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Base Price',
                accessor: 'BasePrice',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Selling Price',
                accessor: 'SellingPrice',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Quantity',
                accessor: d => d.Inventory.Quantity,
                id: 'Quantity',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Warning Quantity',
                accessor: d => d.Inventory.WarningQuantity,
                id: 'WarningQuantity',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Name',
                accessor: 'Name',
                minWidth: 400,
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let name = row[filter.id].toLowerCase();

                    return name.includes(value) ? row : '';
                },
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Base Price',
                accessor: 'BasePrice',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Selling Price',
                accessor: 'SellingPrice',
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Unit',
                accessor: 'Unit',
                minWidth: 200,
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let unit = row[filter.id].toLowerCase();

                    return unit.includes(value) ? row : '';
                },
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Inv Ref',
                accessor: 'InvRef',
                minWidth: 200,
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let invRef = row[filter.id].toLowerCase();

                    return invRef.includes(value) ? row : '';
                },
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Inv Type',
                accessor: 'InvType',
                minWidth: 200,
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let invType = row[filter.id].toLowerCase();

                    return invType.includes(value) ? row : '';
                },
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Location',
                accessor: 'Location',
                minWidth: 300,
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let location = row[filter.id].toLowerCase();

                    return location.includes(value) ? row : '';
                },
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Product Code',
                accessor: 'ProductCode',
                minWidth: 200,
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let productCode = row[filter.id].toLowerCase();

                    return productCode.includes(value) ? row : '';
                },
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Supplier Name',
                accessor: 'SupplierName',
                minWidth: 200,
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let supplierName = row[filter.id].toLowerCase();

                    return supplierName.includes(value) ? row : '';
                },
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Address',
                accessor: 'Address',
                minWidth: 500,
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let address = row[filter.id].toLowerCase();

                    return address.includes(value) ? row : '';
                },
                Cell: props => <div className="text-center">{props.value}</div>
            },
            {
                Header: 'Created At',
                accessor: 'CreatedDate',
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let createdDate = row._original[filter.id].toLowerCase();

                    return createdDate.includes(value) ? row : '';
                },
                Cell: props => (
                    <div className="text-center">
                        {props.original.CreatedDate}
                    </div>
                )
            },
            {
                Header: 'UpdatedAt',
                accessor: 'UpdatedDate',
                filterMethod: (filter, row) => {
                    let value = filter.value.toLowerCase();
                    let updatedDate = row._original[filter.id].toLowerCase();

                    return updatedDate.includes(value) ? row : '';
                },
                Cell: props => (
                    <div className="text-center">
                        {props.original.UpdatedDate}
                    </div>
                )
            }
        ];
    }

    render() {
        let columns = this.getColumns();
        let { data, fetchLoading } = this.props;
        let userData = JSON.parse(localStorage.getItem('userData'));

        return (
            <Layout
                title="Archives"
                userName={`${userData.FirstName} ${userData.LastName}`}
            >
                <div className="col-md-12">
                    <Card cardTitle="Archives Table">
                        <ReactTable
                            filterable
                            data={data}
                            columns={columns}
                            defaultPageSize={10}
                            loading={fetchLoading}
                            className="-striped -highlight"
                            loadingText={
                                <div style={{ display: 'inline-block' }}>
                                    <SemipolarSpinner
                                        color="black"
                                        size={100}
                                    />
                                </div>
                            }
                        />
                    </Card>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = ({ products }) => {
    return {
        data: values(products.data)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchProducts: data => dispatch(fetchProducts(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Archive);
