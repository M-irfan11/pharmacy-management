import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';
function Supplier() {
    const [supplier, setSupplier] = React.useState([]);

    const fetchSupplier = async () => {
        let res = await axios.get(`supplier/index.php`)
        setSupplier(res.data.data);
    };


    React.useEffect(() => {
        fetchSupplier();
    }, []);

    async function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            let res = await axios.delete(`supplier/delete.php?id=${id}`)
            if (res.data.status) {
                fetchSupplier();
            } else {
                alert(res.data.message);
            }

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
                                    className="btn btn-primary btn-rounded float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
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
                                                    <td>{supplier.phone}</td>
                                                    <td>{supplier.email}</td>
                                                    <td>{supplier.address}</td>
                                                    <td>{supplier.description}</td>
                                                    <td className="text-right">
                                                        <Link
                                                            to={`/supplier/edit/${supplier.id}`}
                                                            className="btn btn-sm btn-primary mr-1 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
                                                            title="Edit"
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm !bg-gradient-to-br from-[#D60000] to-[#B70000] !text-white border-0 mr-1"
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