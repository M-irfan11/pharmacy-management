import React from 'react';
import { Link } from 'react-router';
function SupplierCreate() {

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        fetch('http://localhost/pharmacy_api/supplier/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Optionally, you can redirect the user to another page or show a success message here
                window.location.href = '/supplier';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    return (
        <div className="page-wrapper">
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content">

                        {/* Page Header */}
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Add New supplier</h3>

                            {/* <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <a href="#">
                                        <i className="icon-home"></i>
                                    </a>
                                </li>

                                <li className="separator">
                                    <i className="icon-arrow-right"></i>
                                </li>

                                <li className="nav-item">
                                    <Link to="/supplier">Supplier</Link>
                                </li>
                                <li className="separator">
                                    <i className="icon-arrow-right"></i>
                                </li>
                                <li className="nav-item">
                                    <a href="#">Add New</a>
                                </li>
                            </ul> */}
                        </div>

                        {/* Card */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card card-round">

                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="supplier_name">supplier Name</label>
                                                <input type="text" name="supplier_name" className="form-control" id="supplier_Name" placeholder="Enter supplier name" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">phone</label>
                                                <input type="text" name="phone" className="form-control" id="phone_number" placeholder="Enter phone" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">email</label>
                                                <input type="email" name="email" className="form-control" id="email" placeholder="Enter Your Email" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="address">address</label>
                                                <input type="text" name="address" className="form-control" id="address" placeholder="Enter Your Address" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="supplierDescription">supplier Description</label>
                                                <input type="text" name="description" className="form-control" id="supplierDescription" placeholder="Enter supplier description" />
                                            </div>
                                            <button type="submit" className="btn btn-primary mt-3">Add supplier</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupplierCreate