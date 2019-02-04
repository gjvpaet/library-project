import moment from 'moment';
import jparam from 'jquery-param';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { HalfCircleSpinner } from 'react-epic-spinners';

import {
    setProduct,
    addProduct,
    updateProduct,
    setSelectedProduct
} from '../../../../store/actions';

import Modal from '../../../../components/Modal/index.jsx';

import HttpService from '../../../../services/HttpService';

const httpService = new HttpService();

class ProductModal extends Component {
    constructor(props) {
        super(props);

        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        $('#product-form')
            .validator(this.props.selected ? 'validate' : 'update')
            .on('submit', e => this.submit(e));
    }

    handleChange(field, value) {
        this.props.setSelectedProduct({ field, value });
    }

    async submit(e) {
        e.preventDefault();

        let {
            formAction,
            selected,
            addProduct,
            setProduct,
            updateProduct
        } = this.props;
        let {
            Id = '',
            Name = '',
            Unit = '',
            Status = 1,
            InvRef = '',
            Address = '',
            InvType = '',
            Location = '',
            Quantity = '',
            BasePrice = '',
            ProductCode = '',
            SellingPrice = '',
            SupplierName = '',
            WarningQuantity = ''
        } = selected || {};

        setProduct({ formLoading: true });

        let data = {
            Name,
            Unit,
            InvRef,
            Status,
            Address,
            InvType,
            Location,
            Quantity,
            BasePrice,
            ProductCode,
            SellingPrice,
            SupplierName,
            WarningQuantity
        };

        switch (formAction) {
            case 'POST':
                try {
                    let { content, message } = await httpService.insertData(data, 'products');

                    content.CreatedDate = moment(content.CreatedAt).format('MMMM Do YYYY, h:mm a');
                    content.UpdatedDate = moment(content.UpdatedAt).format('MMMM Do YYYY, h:mm a');

                    addProduct(content);
                    setProduct({ formLoading: false });

                    alertify.success(message);
                    $('#products-modal').modal('hide');
                } catch (error) {
                    console.log('error: ', error);
                    alertify.error('Oops, something went wrong.');
                }
                break;
            case 'PUT':
                try {
                    let { content, message } = await httpService.updateData(
                        data,
                        Id,
                        'products',
                        jparam({ action: 'update' })
                    );

                    content.CreatedDate = moment(content.CreatedAt).format('MMMM Do YYYY, h:mm a');
                    content.UpdatedDate = moment(content.UpdatedAt).format('MMMM Do YYYY, h:mm a');

                    updateProduct(content);
                    setProduct({ formLoading: false });

                    alertify.success(message);
                    $('#products-modal').modal('hide');
                } catch (error) {
                    console.log('error: ', error);
                    alertify.error('Oops, something went wrong.');
                }
                break;
            default:
                break;
        }
    }

    closeModal() {
        this.props.setProduct({ formAction: 'POST', selected: null });
        $('#product-form').validator('destroy');
    }

    render() {
        let { selected, formAction, formLoading } = this.props;

        let {
            Name = '',
            Unit = '',
            InvRef = '',
            Address = '',
            InvType = '',
            Location = '',
            Quantity = 0,
            BasePrice = 0,
            ProductCode = '',
            SellingPrice = 0,
            SupplierName = '',
            WarningQuantity = 0
        } = selected || {};

        let inventoryFields =
            formAction === 'PUT' ? (
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group has-feedback">
                            <label htmlFor="WarningQuantity">
                                Warning Quantity{' '}
                                <i className="fa fa-asterisk text-danger" />
                            </label>
                            <input
                                required
                                type="number"
                                id="WarningQuantity"
                                name="WarningQuantity"
                                value={WarningQuantity}
                                className="form-control"
                                placeholder="Enter Warning Quantity"
                                onChange={e =>
                                    this.handleChange(
                                        'WarningQuantity',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col-md-6 col-sm-6 col-xs-12">
                        <div className="form-group has-feedback">
                            <label htmlFor="Quantity">
                                Quantity{' '}
                                <i className="fa fa-asterisk text-danger" />
                            </label>
                            <input
                                required
                                id="Quantity"
                                type="number"
                                name="Quantity"
                                value={Quantity}
                                className="form-control"
                                placeholder="Enter Quantity"
                                onChange={e =>
                                    this.handleChange(
                                        'Quantity',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                        <div className="form-group has-feedback">
                            <label htmlFor="WarningQuantity">
                                Warning Quantity{' '}
                                <i className="fa fa-asterisk text-danger" />
                            </label>
                            <input
                                required
                                type="number"
                                id="WarningQuantity"
                                name="WarningQuantity"
                                value={WarningQuantity}
                                className="form-control"
                                placeholder="Enter Warning Quantity"
                                onChange={e =>
                                    this.handleChange(
                                        'WarningQuantity',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            );

        return (
            <Modal
                formId="product-form"
                modalId="products-modal"
                modalTitle="Add New Product"
                closeModal={this.closeModal}
            >
                <div className="modal-body">
                    <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="Name">
                                    Name{' '}
                                    <i className="fa fa-asterisk text-danger" />
                                </label>
                                <input
                                    required
                                    type="text"
                                    id="Name"
                                    name="Name"
                                    value={Name}
                                    className="form-control"
                                    placeholder="Enter Product Name"
                                    onChange={e =>
                                        this.handleChange(
                                            'Name',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {inventoryFields}
                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="BasePrice">
                                    Base Price{' '}
                                    <i className="fa fa-asterisk text-danger" />
                                </label>
                                <input
                                    required
                                    type="number"
                                    id="BasePrice"
                                    name="BasePrice"
                                    value={BasePrice}
                                    className="form-control"
                                    placeholder="Enter Base Price"
                                    onChange={e =>
                                        this.handleChange(
                                            'BasePrice',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-ms-6 col-sm-6 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="SellingPrice">
                                    Selling Price{' '}
                                    <i className="fa fa-asterisk text-danger" />
                                </label>
                                <input
                                    required
                                    type="number"
                                    id="SellingPrice"
                                    name="SellingPrice"
                                    value={SellingPrice}
                                    className="form-control"
                                    placeholder="Enter Selling Price"
                                    onChange={e =>
                                        this.handleChange(
                                            'SellingPrice',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="Location">Location</label>
                                <input
                                    type="text"
                                    id="Location"
                                    name="Location"
                                    value={Location}
                                    className="form-control"
                                    placeholder="Enter Location"
                                    onChange={e =>
                                        this.handleChange(
                                            'Location',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="ProductCode">Product Code</label>
                                <input
                                    type="text"
                                    id="ProductCode"
                                    name="ProductCode"
                                    value={ProductCode}
                                    className="form-control"
                                    placeholder="Enter Product Code"
                                    onChange={e =>
                                        this.handleChange(
                                            'ProductCode',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="SupplierName">Supplier Name</label>
                                <input
                                    type="text"
                                    id="SupplierName"
                                    name="SupplierName"
                                    value={SupplierName}
                                    className="form-control"
                                    placeholder="Enter Supplier Name"
                                    onChange={e =>
                                        this.handleChange(
                                            'SupplierName',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="Unit">Unit</label>
                                <input
                                    type="text"
                                    id="Unit"
                                    name="Unit"
                                    value={Unit}
                                    className="form-control"
                                    placeholder="Enter Unit"
                                    onChange={e =>
                                        this.handleChange(
                                            'Unit',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="InvType">Inv Type</label>
                                <input
                                    type="text"
                                    id="InvType"
                                    name="InvType"
                                    value={InvType}
                                    className="form-control"
                                    placeholder="Enter Inv Type"
                                    onChange={e =>
                                        this.handleChange(
                                            'InvType',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="InvRef">Inv Ref</label>
                                <input
                                    type="text"
                                    id="InvRef"
                                    name="InvRef"
                                    value={InvRef}
                                    className="form-control"
                                    placeholder="Enter Inv Ref"
                                    onChange={e =>
                                        this.handleChange(
                                            'InvRef',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="form-group has-feedback">
                                <label htmlFor="Address">Address</label>
                                <input
                                    type="text"
                                    id="Address"
                                    name="Address"
                                    value={Address}
                                    className="form-control"
                                    placeholder="Enter Address"
                                    onChange={e =>
                                        this.handleChange(
                                            'Address',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                    <button
                        type="button"
                        data-dismiss="modal"
                        onClick={this.closeModal}
                        className="btn btn-default btn-round"
                    >
                        Close
                    </button>
                    <button type="submit" className="btn btn-primary btn-round">
                        {formLoading ? (
                            <HalfCircleSpinner size={20} color="black" />
                        ) : (
                            'Save'
                        )}
                    </button>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        selected: state.products.selected,
        formAction: state.products.formAction,
        formLoading: state.products.formLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addProduct: data => dispatch(addProduct(data)),
        setProduct: data => dispatch(setProduct(data)),
        updateProduct: data => dispatch(updateProduct(data)),
        setSelectedProduct: data => dispatch(setSelectedProduct(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductModal);
