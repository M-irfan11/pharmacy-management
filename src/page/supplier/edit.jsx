import React from 'react';
import { Link, useParams } from 'react-router';

function SupplierEdit() {
    const { id } = useParams();

    const [supplier, setSupplier] = React.useState({});

    function fetchSupplier() {
        fetch('http://localhost/pharmacy_api/supplier/single.php?id=' + id)
            .then(response => response.json())
            .then(data => setSupplier(data.data[0]))
            .catch(error => console.error('Error fetching supplier:', error));
    }

    React.useEffect(() => {
        fetchSupplier();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        fetch('http://localhost/pharmacy_api/supplier/update.php?id=' + supplier.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.href = '/supplier';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="main-wrapper">
            <div className="page-wrapper">
                <div className="content">

                    {/* Page Header */}
                    <div className="row">
                        <div className="col-sm-4 col-3">
                            <h4 className="page-title">Edit Supplier</h4>
                        </div>
                        <div className="col-sm-8 col-9 text-right m-b-20">
                            <Link to="/supplier" className="btn btn-primary btn-rounded float-right">
                                <i className="fa fa-arrow-left"></i> Back
                            </Link>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="supplier_Name">supplier Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="supplier_Name"
                                        className="form-control"
                                        placeholder="Enter supplier name"
                                        value={supplier.supplier_name || ''}
                                        onChange={(e) => setSupplier({ ...supplier, supplier_name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">phone</label>
                                    <input
                                        type="number"
                                        name="phone"
                                        id="phone"
                                        className="form-control"
                                        placeholder="Enter phone number"
                                        value={supplier.phone || ''}
                                        onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="Enter Your email"
                                        value={supplier.email || ''}
                                        onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="form-control"
                                        placeholder="Enter Your Address"
                                        value={supplier.address || ''}
                                        onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="supplierDescription">supplier Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        id="supplierDescription"
                                        className="form-control"
                                        placeholder="Enter supplier description"
                                        value={supplier.description || ''}
                                        onChange={(e) => setSupplier({ ...supplier, description: e.target.value })}
                                    />
                                </div>

                                <div className="m-t-20 text-center">
                                    <button type="submit" className="btn btn-primary submit-btn">
                                        Update supplier
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SupplierEdit;