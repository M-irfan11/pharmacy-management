import React from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';

function SupplierCreate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [supplier, setSupplier] = React.useState({
        supplier_name: '',
        phone: '',
        email: '',
        address: '',
        description: ''
    });
    const [error, setError] = React.useState('');

    const fetchSupplier = async () => {
        const res = await axios.get(`supplier/single.php?id=${id}`);
        if (res.data && res.data.data && res.data.data[0]) {
            setSupplier(res.data.data[0]);
        }
    };

    React.useEffect(() => {
        if (id) {
            fetchSupplier();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let url = '';


        if (id) {
            url = `supplier/update.php?id=${id}`;
        } else {
            url = 'supplier/create.php';
        }
        let response = await axios.post(url, formData);

        window.location.href = '/supplier';

        // try {
        //     

        // } catch (err) {
        //     console.error('Error message:', err.message);
        //     console.error('Error status:', err.response?.status);
        //     console.error('Error response:', err.response?.data);
        // }

    };

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="main-wrapper">
                    <div className="page-wrapper">
                        <div className="content">
                            <div className="page-header">
                                <h3 className="fw-bold mb-3">{id ? 'Edit Supplier' : 'Add New Supplier'}</h3>

                                <ul className="breadcrumbs mb-3">
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
                                        <a href="#">{id ? 'Edit' : 'Add New'}</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card card-round">
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="supplier_name">Supplier Name</label>
                                                    <input
                                                        type="text"
                                                        name="supplier_name"
                                                        className="form-control"
                                                        id="supplier_Name"
                                                        placeholder="Enter supplier name"
                                                        value={supplier.supplier_name || ''}
                                                        onChange={(e) => setSupplier({ ...supplier, supplier_name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="phone">Phone</label>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        className="form-control"
                                                        id="phone"
                                                        placeholder="Enter phone"
                                                        value={supplier.phone || ''}
                                                        onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control"
                                                        id="email"
                                                        placeholder="Enter Your Email"
                                                        value={supplier.email || ''}
                                                        onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="address">Address</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        className="form-control"
                                                        id="address"
                                                        placeholder="Enter Your Address"
                                                        value={supplier.address || ''}
                                                        onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="supplierDescription">Supplier Description</label>
                                                    <input
                                                        type="text"
                                                        name="description"
                                                        className="form-control"
                                                        id="supplierDescription"
                                                        placeholder="Enter supplier description"
                                                        value={supplier.description || ''}
                                                        onChange={(e) => setSupplier({ ...supplier, description: e.target.value })}
                                                    />
                                                </div>
                                                {id ? (<button type="submit" className="btn btn-primary mt-3">Update Supplier</button>) : (<button type="submit" className="btn btn-primary mt-3">Add Supplier</button>)}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default SupplierCreate;