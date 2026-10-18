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

function SaleCreate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUserId = getUserId();
    const [sale, setSale] = useState({
        customer_name: '',
        invoice_no: '',
        sale_date: '',
        user_id: currentUserId,
    });
    const [medicines, setMedicines] = useState([]);
    const [items, setItems] = useState([]);
    const [saving, setSaving] = useState(false);
    const setSaleField = (field) => (event) => setSale(current => ({ ...current, [field]: event.target.value }));

    async function fetchPoNO() {
        const res = await axios.get("sales/get_po_no.php");

        if(res.data?.sale_no) {
            setSale(current => ({
                ...current,
                invoice_no: String(res.data.sale_no),
            }));
        }else {
            alert("Invoice number could not be fetched. Please try again.");
        }
    }

    async function fetchMedicines() {
        let res = await axios.get("medicines/index.php");
            if (res.data?.data) {
                setMedicines(res.data.data);
            }
        }


    useEffect(() => {
        fetchPoNO();
        fetchMedicines();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const invalidItem = items.some(item => !Number.isInteger(Number(item.quantity))
            || Number(item.quantity) < 1 || item.unit_price === ''
            || !Number.isFinite(Number(item.unit_price)) || Number(item.unit_price) < 0);
        if (items.length === 0 || invalidItem) {
            alert('Add at least one medicine and enter a valid quantity and price for every item');
            return;
        }
        const payload = {
            ...sale,
            items: items.map(({ medicine_id, quantity, unit_price }) => ({ medicine_id, quantity, unit_price })),
        };
        const formData = new FormData();
        formData.append('payload', JSON.stringify(payload));
        setSaving(true);
        try {
            const response = await axios.post(id ? `sale/update.php?id=${id}` : 'sale/create.php', formData);
            if (!response.data?.status) {
                alert(response.data?.message || 'Sale could not be saved');
                return;
            }
            navigate('/sales');
        } catch (error) {
            console.error('Sale save error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Sale could not be saved');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <h3 className="fw-bold mb-3">{id ? 'Edit Sale Invoice' : 'New Sale Invoice'}</h3>
                        <ul className="breadcrumbs mb-3">
                            <li className="nav-item"><Link to="/sales">Sales</Link></li>
                            <li className="separator"><i className="icon-arrow-right"></i></li>
                            <li className="nav-item">{id ? 'Edit' : 'New'}</li>
                        </ul>
                    </div>
                    <div className="card card-round">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="form-group col-md-4">
                                        <label htmlFor="customer_name">Customer</label>
                                        <input id="customer_name" className="form-control" value={sale.customer_name} onChange={setSaleField('customer_name')} required maxLength="150" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label htmlFor="invoice_no">Invoice No</label>
                                        <input id="invoice_no" className="form-control" value={sale.invoice_no} readOnly required maxLength="50" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label htmlFor="sale_date">Sale Date</label>
                                        <input id="sale_date" type="date" className="form-control" value={sale.sale_date} onChange={setSaleField('sale_date')} required />
                                    </div>
                                </div>
                                <InvoiceItems type="sale" medicines={medicines} items={items} setItems={setItems} />
                                <button type="submit" disabled={saving} className="btn btn-primary mt-3 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                                    {saving ? 'Saving...' : id ? 'Update Invoice' : 'Save Sale'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default SaleCreate;
