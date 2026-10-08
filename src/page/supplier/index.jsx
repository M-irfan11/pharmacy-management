import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";

function Supplier() {
    const [supplier, setSupplier] = React.useState([]);

    function fetchSupplier() {
        fetch('http://localhost/pharmacy_api/supplier/index.php')
            .then(response => response.json())
            .then(data => setSupplier(data.data))
            .catch(error => console.error('Error fetching supplier:', error));
    }

    React.useEffect(() => {
        fetchSupplier();
    }, []);

    function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            fetch(`http://localhost/pharmacy_api/supplier/delete.php?id=${id}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status == 'true') {
                        fetchSupplier();
                    }
                })
                .catch(error => console.error('Error deleting supplier:', error));
        }
    }

    return (
        <Layout>
        <div className="main-wrapper">
            <div className="page-wrapper">
                <div className="content">

                    {/* Page Header */}
                    <div className="row">
                        <div className="col-sm-4 col-3">
                            <h4 className="page-title">Supplier</h4>
                        </div>
                        <div className="col-sm-8 col-9 text-right m-b-20">
                            <Link
                                to="/supplier/create"
                                className="btn btn-primary btn-rounded float-right"
                            >
                                <i className="fa fa-plus"></i> Add Supplier
                            </Link>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <table className="table table-border table-striped custom-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>supplier Name</th>
                                            
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Address</th>
                                            <th>Description</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {supplier.map((supplier, index) => (
                                            <tr key={supplier.id}>
                                                <td>{index + 1}</td>
                                                <td>{supplier.supplier_name}</td>
                                                <td>{supplier.phone_number}</td>
                                                <td>{supplier.email}</td>
                                                <td>{supplier.address}</td>
                                                <td>{supplier.description}</td>
                                                <td className="text-right">
                                                    <Link
                                                        to={`/supplier/edit/${supplier.id}`}
                                                        className="btn btn-sm btn-primary mr-1"
                                                        title="Edit"
                                                    >
                                                        <i className="fa fa-pencil"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        title="Delete"
                                                        onClick={() => handleDelete(supplier.id)}
                                                    >
                                                        <i className="fa fa-trash-o"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
     </Layout>
    );
}

export default Supplier;