
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Layout from "../Layout.jsx";
import InvoiceItems from '../InvoiceItems.jsx';
import axios from '../../LIb/axios.js';

const getUserId = () => {
    try {
        return JSON.parse(localStorage.getItem('userdata') || '{}')?.id || '';
    } catch {
        return '';
    }
};

function PurchaseCreate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUserId = getUserId();
    const [purchase, setPurchase] = useState({
        supplier_id: '',
        invoice_no: '',
        purchase_date: '',
        user_id: currentUserId,
    });
    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [items, setItems] = useState([]);
    const [saving, setSaving] = useState(false);
    const setPurchaseField = (field) => (event) => setPurchase(current => ({ ...current, [field]: event.target.value }));

        // async function fetchPurchase() {
        //     let res = await axios.get("Purchase/index.php");
        //     if (res.data.data) {
        //         setPurchase(res.data.data);
        //     }
        // }    
    // async function fetchPoNo() {
    //     let res = await axios.get("purchase/get_po_no.php");
    //     if (res.data.pur_no) {
    //         setPurchaseNo(res.data.pur_no);
    //     }
    // }

    async function fetchPoNo() {
    const res = await axios.get("purchase/get_po_no.php");

    if (res.data?.pur_no) {
        setPurchase(current => ({
            ...current,
            invoice_no: String(res.data.pur_no),
        }));
    } else {
        alert("Invoice number could not be fetched. Please try again.");
    }
}
    async function fetchSupplier() {
        let res = await axios.get("supplier/index.php");
        if (res.data.data) {
            setSuppliers(res.data.data);
        }
    }
    async function fetchMedicines() {
        let res = await axios.get("medicines/index.php");
        if (res.data.data) {
            setMedicines(res.data.data);
        }
    }  

    useEffect(() => {
        fetchPoNo();        
        // fetchPurchase();
        fetchSupplier();
        fetchMedicines();
    }, []);

    

    const handleSubmit = async (event) => {
        event.preventDefault();

        const invalidItem = items.some(item =>
            !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1
            || item.unit_price === '' || !Number.isFinite(Number(item.unit_price))
            || Number(item.unit_price) < 0
        );
        if (!items.length || invalidItem) {
            alert('Add at least one medicine and enter a valid quantity and price for every item');
            return;
        }

        const formData = new FormData();
        formData.append('payload', JSON.stringify({
            ...purchase,
            items: items.map(({ medicine_id, quantity, unit_price }) => ({ medicine_id, quantity, unit_price })),
        }));
        setSaving(true);

        try {
            const response = await axios.post(id ? `purchase/update.php?id=${id}` : 'purchase/create.php', formData);
            if (!response.data?.status) {
                alert(response.data?.message || 'Purchase could not be saved');
                return;
            }
            navigate('/purchases');
        } catch (error) {
            console.error('Purchase save error:', error);
            alert(error.response?.data?.message || 'Purchase could not be saved');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <h3 className="fw-bold mb-3">{id ? 'Edit Purchase Invoice' : 'New Purchase Invoice'}</h3>
                        <ul className="breadcrumbs mb-3">
                            <li className="nav-item"><Link to="/purchases">Purchases</Link></li>
                            <li className="separator"><i className="icon-arrow-right"></i></li><li className="nav-item">{id ? 'Edit' : 'New'}</li>
                        </ul>
                    </div>
                    <div className="card card-round">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="form-group col-md-4">
                                        <label htmlFor="supplier_id">Supplier</label>
                                        <select id="supplier_id" className="form-control" value={purchase.supplier_id} onChange={setPurchaseField('supplier_id')} required>
                                            <option value="">Select supplier</option>
                                            {suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.supplier_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label htmlFor="invoice_no">Invoice No</label><input readOnly id="invoice_no" className="form-control" value= {purchase.invoice_no} required maxLength="50" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label htmlFor="purchase_date">Purchase Date</label><input id="purchase_date" type="date" className="form-control" value={purchase.purchase_date} onChange={setPurchaseField('purchase_date')} required />
                                    </div>
                                </div>
                                <InvoiceItems type="purchase" medicines={medicines} items={items} setItems={setItems} />
                                <button type="submit" disabled={saving} className="btn btn-primary mt-3 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">{saving ? 'Saving...' : id ? 'Update Invoice' : 'Save Purchase'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default PurchaseCreate;
