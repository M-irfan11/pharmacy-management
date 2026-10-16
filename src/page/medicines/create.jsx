import React from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js'; 

function MedicinesCreate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [medicines, setMedicines] = React.useState({
        category_id: '',
        supplier_id: '',
        medicine_name: '',
        batch_no: '',
        purchase_price: '',
        selling_price: '',
        stock_qty: '',
        expiry_date: ''
    });
    const [categories, setCategories] = React.useState([]);
    const [suppliers, setSuppliers] = React.useState([]);

    const set = (field) => (e) => setMedicines({ ...medicines, [field]: e.target.value });

    React.useEffect(() => {
       
        axios.get('category/index.php').then(res => setCategories(res.data?.data || []));
        axios.get('supplier/index.php').then(res => setSuppliers(res.data?.data || []));

        if (id) {
            axios.get(`medicines/single.php?id=${id}`).then(res => {
                if (res.data?.data?.[0]) setMedicines(res.data.data[0]);
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = id ? `medicines/update.php?id=${id}` : 'medicines/create.php';

        try {
            const response = await axios.post(url, formData);
            console.log(response.data);
            navigate('/medicines');
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            alert('Save failed');
        }
    };

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <h3 className="fw-bold mb-3">{id ? 'Edit Medicine' : 'Add New Medicine'}</h3>
                        <ul className="breadcrumbs mb-3">
                            <li className="nav-home"><a href="#"><i className="icon-home"></i></a></li>
                            <li className="separator"><i className="icon-arrow-right"></i></li>
                            <li className="nav-item"><Link to="/medicines">Medicines</Link></li>
                            <li className="separator"><i className="icon-arrow-right"></i></li>
                            <li className="nav-item"><a href="#">{id ? 'Edit' : 'Add New'}</a></li>
                        </ul>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-round">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="category_id">Category</label>
                                            <select name="category_id" id="category_id" className="form-control"
                                                value={medicines.category_id || ''} onChange={set('category_id')} required>
                                                <option value="">Select category</option>
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="supplier_id">Supplier</label>
                                            <select name="supplier_id" id="supplier_id" className="form-control"
                                                value={medicines.supplier_id || ''} onChange={set('supplier_id')} required>
                                                <option value="">Select supplier</option>
                                                {suppliers.map(s => (
                                                    <option key={s.id} value={s.id}>{s.supplier_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="medicine_name">Medicine Name</label>
                                            <input type="text" name="medicine_name" id="medicine_name" className="form-control"
                                                placeholder="Enter medicine name"
                                                value={medicines.medicine_name || ''} onChange={set('medicine_name')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="batch_no">Batch No</label>
                                            <input type="text" name="batch_no" id="batch_no" className="form-control"
                                                placeholder="Enter batch number"
                                                value={medicines.batch_no || ''} onChange={set('batch_no')} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="purchase_price">Purchase Price</label>
                                            <input type="number" step="0.01" name="purchase_price" id="purchase_price" className="form-control"
                                                placeholder="Enter purchase price"
                                                value={medicines.purchase_price || ''} onChange={set('purchase_price')} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="selling_price">Selling Price</label>
                                            <input type="number" step="0.01" name="selling_price" id="selling_price" className="form-control"
                                                placeholder="Enter selling price"
                                                value={medicines.selling_price || ''} onChange={set('selling_price')} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="stock_qty">Stock Quantity</label>
                                            <input type="number" name="stock_qty" id="stock_qty" className="form-control"
                                                placeholder="Enter stock quantity"
                                                value={medicines.stock_qty || ''} onChange={set('stock_qty')} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="expiry_date">Expiry Date</label>
                                            <input type="date" name="expiry_date" id="expiry_date" className="form-control"
                                                value={medicines.expiry_date || ''} onChange={set('expiry_date')} />
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-3 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                                            {id ? 'Update Medicine' : 'Add Medicine'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default MedicinesCreate;