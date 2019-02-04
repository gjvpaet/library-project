import moment from 'moment';
import { values } from 'lodash';
import jparam from 'jquery-param';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { ChildButton } from 'react-mfb';
import React, { Component } from 'react';
import { SemipolarSpinner } from 'react-epic-spinners';

import 'react-mfb/mfb.css';
import 'react-tippy/dist/tippy.css';
import 'react-table/react-table.css';

import { convertArrayOfObjectsToCSV } from '../../utils/csvConverter';

import { setProduct, fetchProducts, deleteProduct } from '../../store/actions';

import StockModal from './containers/StockModal/index.jsx';
import ProductModal from './containers/ProductModal/index.jsx';
import TransactionModal from './containers/TransactionModal/index.jsx';

import FAB from '../../components/FAB/index.jsx';
import Card from '../../components/Card/index.jsx';
import Layout from '../../components/Layout/index.jsx';

import HttpService from '../../services/HttpService';

const httpService = new HttpService();

class Products extends Component {
    constructor(props) {
        super(props);

        ['export', 'addProduct', 'getProducts'].map(
            fn => (this[fn] = this[fn].bind(this))
        );
    }

    async componentDidMount() {
        this.getProducts();
    }

    async getProducts() {
        let { fetchProducts } = this.props;

        try {
            let result = await httpService.getAllData(
                'products',
                jparam({ status: 1 })
            );

            result.list = result.list.map(data => {
                data.CreatedDate = moment(data.CreatedAt).format(
                    'MMMM Do YYYY, h:mm a'
                );
                data.UpdatedDate = moment(data.UpdatedAt).format(
                    'MMMM Do YYYY, h:mm a'
                );

                return data;
            });

            fetchProducts(result.list);
        } catch (error) {
            console.log('error: ', error);
        }
    }

    getColums() {
        return [
            {
                Header: 'Stocks',
                Cell: props => (
                    <div className="text-center">
                        <Tooltip
                            title="Add Stock"
                            position="bottom"
                            animation="scale"
                        >
                            <button
                                className="btn btn-primary btn-fab btn-icon btn-round"
                                onClick={e =>
                                    this.modifyStock(props.original, 'ADD')
                                }
                            >
                                <i className="now-ui-icons ui-1_simple-add" />
                            </button>
                        </Tooltip>
                        &nbsp;
                        <Tooltip
                            title="Reduce Stock"
                            position="right"
                            animation="scale"
                        >
                            <button
                                className="btn btn-danger btn-fab btn-icon btn-round"
                                onClick={e =>
                                    this.modifyStock(props.original, 'SUBTRACT')
                                }
                            >
                                <i className="now-ui-icons ui-1_simple-delete" />
                            </button>
                        </Tooltip>
                    </div>
                ),
                Filter: () => {}
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
                Header: 'Created At',
                accessor: 'CreatedDate',
                minWidth: 200,
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
                minWidth: 200,
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
            },
            {
                Header: 'Actions',
                Cell: props => {
                    return (
                        <div className="text-center">
                            <Tooltip
                                title="Edit"
                                position="left"
                                animation="scale"
                            >
                                <button
                                    className="btn btn-primary btn-fab btn-icon btn-round"
                                    onClick={e =>
                                        this.editProduct(e, props.original)
                                    }
                                >
                                    <i className="now-ui-icons design-2_ruler-pencil" />
                                </button>
                            </Tooltip>
                            &nbsp;
                            <Tooltip
                                title="Archive"
                                position="bottom"
                                animation="scale"
                            >
                                <button
                                    className="btn btn-danger btn-fab btn-icon btn-round"
                                    onClick={e =>
                                        this.deleteProduct(props.original.Id)
                                    }
                                >
                                    <i className="now-ui-icons ui-1_simple-remove" />
                                </button>
                            </Tooltip>
                        </div>
                    );
                },
                Filter: () => {}
            }
        ];
    }

    addProduct(event) {
        this.props.setProduct({ formAction: 'POST' });
        $('#products-modal').modal('show');
        $('#product-form').validator();
    }

    editProduct(event, product) {
        this.props.setProduct({
            formAction: 'PUT',
            selected: {
                ...product,
                WarningQuantity: product.Inventory.WarningQuantity
            }
        });

        $('#products-modal').modal('show');
        $('#product-form').validator();
    }

    deleteProduct(id) {
        alertify.confirm(
            'Warning',
            'Are you sure you want to archive this?',
            async () => {
                try {
                    let { data, fetchProducts } = this.props;
                    let payload = { Status: 0 };

                    let result = await httpService.updateData(
                        payload,
                        id,
                        'products',
                        jparam({ action: 'archive' })
                    );

                    let newData = data.filter(d => d.Id !== id);
                    fetchProducts(newData);

                    alertify.success('Successfully archived data.');
                } catch (error) {
                    console.log('error: ', error);
                    alertify.error('Oops, something went wrong.');
                }
            },
            () => {}
        );
    }

    openTransactionModal() {
        $('#transactions-modal').modal('show');
    }

    modifyStock(product, action) {
        this.props.setProduct({
            selectedStocks: {
                ...product,
                Quantity: 0,
                Action: action,
                InventoryId: product.Inventory.Id,
                OriginalQuantity: product.Inventory.Quantity
            },
            formAction: 'PUT'
        });

        $('#stocks-modal').modal('show');
        $('#stock-form').validator();
    }

    export() {
        let rowData = [];
        let filteredData = this.reactTable.getResolvedState().sortedData;

        filteredData.map(data => {
            let dataObj = {};

            dataObj['Description'] = data.Description;
            dataObj['Base Price'] = data.BasePrice;
            dataObj['Selling Price'] = data.SellingPrice;
            dataObj['Quantity'] = data.Quantity;
            dataObj['Warning Quantity'] = data.WarningQuantity;
            dataObj['Created At'] = moment(data._original.CreatedAt).format(
                'MMMM Do YYYY'
            );
            dataObj['Updated At'] = moment(data._original.UpdatedAt).format(
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

    render() {
        let columns = this.getColums();
        let { data, fetchLoading } = this.props;
        let userData = JSON.parse(localStorage.getItem('userData'));

        return (
            <Layout
                title="Products"
                userName={`${userData.FirstName} ${userData.LastName}`}
            >
                <div className="col-md-12">
                    <Card cardTitle="Products Table">
                        <ReactTable
                            filterable
                            data={data}
                            columns={columns}
                            defaultPageSize={10}
                            loading={fetchLoading}
                            ref={r => (this.reactTable = r)}
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
                    <FAB
                        position="br"
                        method="hover"
                        effect="slidein-spring"
                        mainBtnStyle={{ color: 'white' }}
                        mainBtnIconActive="now-ui-icons ui-1_simple-remove"
                        mainBtnIconResting="now-ui-icons design_bullet-list-67"
                    >
                        <ChildButton
                            label="Add Product"
                            onClick={this.addProduct}
                            style={{ color: 'white' }}
                            icon="now-ui-icons ui-1_simple-add"
                        />
                        <ChildButton
                            label="Transactions"
                            style={{ color: 'white' }}
                            icon="now-ui-icons files_paper"
                            onClick={this.openTransactionModal}
                        />
                        <ChildButton
                            label="Export"
                            onClick={this.export}
                            style={{ color: 'white' }}
                            icon="now-ui-icons arrows-1_cloud-download-93"
                        />
                    </FAB>
                </div>
                <ProductModal />
                <StockModal />
                <TransactionModal />
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        data: values(state.products.data),
        fetchLoading: state.products.fetchLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setProduct: data => dispatch(setProduct(data)),
        deleteProduct: id => dispatch(deleteProduct(id)),
        fetchProducts: data => dispatch(fetchProducts(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Products);
