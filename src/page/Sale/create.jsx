import React from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';

function SaleCreate() {
    const { id } = useParams();
    const navigate = useNavigate();


    const currentUserId = (() => {
        try {
            return JSON.parse(localStorage.getItem('userdata'))?.id || '';
        } catch {
            return '';
        }
    })();

    const [sale, setSale] = React.useState({
        customer_name: '',
        medicine_id: '',
        invoice_no: '',
        sale_date: '',
        quantity: '',
        price: '',
        subtotal: '',
        user_id: currentUserId,
    });
    const [medicines, setMedicines] = React.useState([]);

    const set = (field) => (e) => setSale(current => ({ ...current, [field]: e.target.value }));
    const subtotal = Number(sale.quantity || 0) * Number(sale.price || 0);

    React.useEffect(() => {
        axios.get('medicines/index.php').then(res => setMedicines(res.data?.data || []));

        if (id) {
            axios.get(`sale/single.php?id=${id}`).then(res => {
                const row = res.data?.data?.[0];
                if (row) {
                    setSale({
                        customer_name: row.customer_name ?? '',
                        medicine_id: row.medicine_id ?? '',
                        invoice_no: row.invoice_no ?? '',
                        sale_date: row.sale_date ?? '',
                        quantity: row.quantity ?? '',
                        price: row.price ?? '',
                        subtotal: row.subtotal ?? '',
                        user_id: row.user_id ?? currentUserId,
                    });
                }
            });
        }
    }, [id, currentUserId]);

    const handleSubmit = async (e) => {
        e.preventDefault();


        const formData = new FormData();
        formData.append('customer_name', sale.customer_name);
        formData.append('medicine_id', sale.medicine_id);
        formData.append('invoice_no', sale.invoice_no);
        formData.append('sale_date', sale.sale_date);
        formData.append('quantity', sale.quantity);
        formData.append('price', sale.price);
        formData.append('subtotal', subtotal.toFixed(2));
        formData.append('user_id', sale.user_id);

        const url = id ? `sale/update.php?id=${id}` : 'sale/create.php';

        try {
            const response = await axios.post(url, formData);
            if (response.data?.status === false) {
                alert(response.data.message || 'Save failed');
                return;
            }
            navigate('/sales');
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
                        <h3 className="fw-bold mb-3">{id ? 'Edit Sale' : 'Add New Sale'}</h3>
                        <ul className="breadcrumbs mb-3">
                            <li className="nav-home"><a href="#"><i className="icon-home"></i></a></li>
                            <li className="separator"><i className="icon-arrow-right"></i></li>
                            <li className="nav-item"><Link to="/sales">Sales</Link></li>
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
                                            <label htmlFor="customer_name">Customer</label>
                                            <input type="text" id="customer_name" className="form-control"
                                                placeholder="Enter customer name"
                                                value={sale.customer_name} onChange={set('customer_name')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="medicine_id">Medicine</label>
                                            <select id="medicine_id" className="form-control"
                                                value={sale.medicine_id} onChange={set('medicine_id')} required>
                                                <option value="">Select medicine</option>
                                                {medicines.map(medicine => (
                                                    <option key={medicine.id} value={medicine.id}>
                                                        {medicine.medicine_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="invoice_no">Invoice No</label>
                                            <input type="text" id="invoice_no" className="form-control"
                                                placeholder="Enter invoice number"
                                                value={sale.invoice_no} onChange={set('invoice_no')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="sale_date">Sale Date</label>
                                            <input type="date" id="sale_date" className="form-control"
                                                value={sale.sale_date} onChange={set('sale_date')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="quantity">Quantity</label>
                                            <input type="number" min="1" step="1" id="quantity" className="form-control"
                                                placeholder="Enter quantity"
                                                value={sale.quantity} onChange={set('quantity')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Sale Price</label>
                                            <input type="number" min="0" step="0.01" id="price" className="form-control"
                                                placeholder="Enter price per unit"
                                                value={sale.price} onChange={set('price')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="subtotal">Subtotal</label>
                                            <input type="number" id="subtotal" className="form-control"
                                                value={subtotal.toFixed(2)} readOnly />
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-3 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                                            {id ? 'Update Sale' : 'Add Sale'}
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

export default SaleCreate;
