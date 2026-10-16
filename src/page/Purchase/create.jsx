import React from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';

function PurchaseCreate() {
    const { id } = useParams();
    const navigate = useNavigate();

    
    const currentUserId = (() => {
        try {
            return JSON.parse(localStorage.getItem('userdata'))?.id || '';
        } catch {
            return '';
        }
    })();

    const [purchase, setPurchase] = React.useState({
        supplier_id: '',
        medicine_id: '',
        invoice_no: '',
        purchase_date: '',
        quantity: '',
        price: '',
        user_id: currentUserId,
    });
    const [suppliers, setSuppliers] = React.useState([]);
    const [medicines, setMedicines] = React.useState([]);

    const set = (field) => (e) => setPurchase(current => ({ ...current, [field]: e.target.value }));
    const subtotal = Number(purchase.quantity || 0) * Number(purchase.price || 0);

    React.useEffect(() => {
        axios.get('supplier/index.php').then(res => setSuppliers(res.data?.data || []));
        axios.get('medicines/index.php').then(res => setMedicines(res.data?.data || []));

        if (id) {
            axios.get(`purchase/single.php?id=${id}`).then(res => {
                const row = res.data?.data?.[0];
                if (row) {
                    setPurchase({
                        supplier_id: row.supplier_id ?? '',
                        medicine_id: row.medicine_id ?? '',
                        invoice_no: row.invoice_no ?? '',
                        purchase_date: row.purchase_date ?? '',
                        quantity: row.quantity ?? '',
                        price: row.price ?? '',
                        user_id: row.user_id ?? currentUserId,
                    });
                }
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        const formData = new FormData();
        formData.append('supplier_id', purchase.supplier_id);
        formData.append('medicine_id', purchase.medicine_id);
        formData.append('invoice_no', purchase.invoice_no);
        formData.append('purchase_date', purchase.purchase_date);
        formData.append('quantity', purchase.quantity);
        formData.append('price', purchase.price);
        formData.append('subtotal', subtotal.toFixed(2));
        formData.append('user_id', purchase.user_id);

        const url = id ? `purchase/update.php?id=${id}` : 'purchase/create.php';

        try {
            const response = await axios.post(url, formData);
            if (response.data?.status === false) {
                alert(response.data.message || 'Save failed');
                return;
            }
            navigate('/purchases');
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
                        <h3 className="fw-bold mb-3">{id ? 'Edit Purchase' : 'Add New Purchase'}</h3>
                        <ul className="breadcrumbs mb-3">
                            <li className="nav-home"><a href="#"><i className="icon-home"></i></a></li>
                            <li className="separator"><i className="icon-arrow-right"></i></li>
                            <li className="nav-item"><Link to="/purchases">Purchases</Link></li>
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
                                            <label htmlFor="supplier_id">Supplier</label>
                                            <select id="supplier_id" className="form-control"
                                                value={purchase.supplier_id} onChange={set('supplier_id')} required>
                                                <option value="">Select supplier</option>
                                                {suppliers.map(s => (
                                                    <option key={s.id} value={s.id}>{s.supplier_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="medicine_id">Medicine</label>
                                            <select id="medicine_id" className="form-control"
                                                value={purchase.medicine_id} onChange={set('medicine_id')} required>
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
                                                value={purchase.invoice_no} onChange={set('invoice_no')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="purchase_date">Purchase Date</label>
                                            <input type="date" id="purchase_date" className="form-control"
                                                value={purchase.purchase_date} onChange={set('purchase_date')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="quantity">Quantity</label>
                                            <input type="number" min="1" step="1" id="quantity" className="form-control"
                                                placeholder="Enter quantity"
                                                value={purchase.quantity} onChange={set('quantity')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Purchase Price</label>
                                            <input type="number" min="0" step="0.01" id="price" className="form-control"
                                                placeholder="Enter price per unit"
                                                value={purchase.price} onChange={set('price')} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="subtotal">Subtotal</label>
                                            <input type="number" id="subtotal" className="form-control"
                                                value={subtotal.toFixed(2)} readOnly />
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-3 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                                            {id ? 'Update Purchase' : 'Add Purchase'}
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

export default PurchaseCreate;
