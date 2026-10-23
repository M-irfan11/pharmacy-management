import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Layout from '../Layout.jsx';
import axios from '../../LIb/axios.js';

function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function SaleReturnCreate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [saleId, setSaleId] = useState('');
    const [saleItems, setSaleItems] = useState([]);
    const [items, setItems] = useState([]);
    const [draft, setDraft] = useState({ sale_item_id: '', quantity: '1' });
    const [returnDate, setReturnDate] = useState(today());
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                if (!id) {
                    const response = await axios.get('sale_return/options.php');
                    if (!response.data?.status) throw new Error(response.data?.message || 'Sale options could not be loaded');
                    if (active) setSales(response.data.data.invoices || []);
                    return;
                }
                const response = await axios.get(`sale_return/single.php?id=${id}`);
                const saleReturn = response.data?.data?.[0];
                if (!response.data?.status || !saleReturn) {
                    throw new Error(response.data?.message || 'Sale return could not be found');
                }
                const optionsResponse = await axios.get('sale_return/options.php', {
                    params: { invoice_id: saleReturn.sale_id, return_id: id },
                });
                if (!optionsResponse.data?.status) {
                    throw new Error(optionsResponse.data?.message || 'Sale items could not be loaded');
                }
                if (!active) return;
                setSales(optionsResponse.data.data.invoices || []);
                setSaleItems(optionsResponse.data.data.items || []);
                setSaleId(String(saleReturn.sale_id));
                setReturnDate(String(saleReturn.return_date).slice(0, 10));
                setReason(saleReturn.reason || '');
                setItems((saleReturn.items || []).map(item => {
                    const option = optionsResponse.data.data.items.find(
                        row => String(row.invoice_item_id) === String(item.invoice_item_id)
                    );
                    return option ? {
                        ...option,
                        row_id: String(option.invoice_item_id),
                        quantity: String(item.quantity),
                    } : null;
                }).filter(Boolean));
            } catch (loadError) {
                if (active) setError(loadError.response?.data?.message || loadError.message || 'Sale return could not be loaded');
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, [id]);

    async function selectSale(event) {
        const value = event.target.value;
        setSaleId(value);
        setItems([]);
        setSaleItems([]);
        setDraft({ sale_item_id: '', quantity: '1' });
        setError('');
        if (!value) return;
        try {
            const response = await axios.get('sale_return/options.php', {
                params: { invoice_id: value },
            });
            if (!response.data?.status) throw new Error(response.data?.message || 'Sale items could not be loaded');
            setSaleItems(response.data.data.items || []);
        } catch (loadError) {
            setError(loadError.response?.data?.message || loadError.message || 'Sale items could not be loaded');
        }
    }

    function addItem() {
        const selected = saleItems.find(item => String(item.invoice_item_id) === draft.sale_item_id);
        const quantity = Number(draft.quantity);
        if (!selected || !Number.isInteger(quantity) || quantity < 1 || quantity > Number(selected.available_quantity)) {
            setError('Select a sale item and enter a quantity within the remaining amount');
            return;
        }
        if (items.some(item => String(item.invoice_item_id) === String(selected.invoice_item_id))) {
            setError('This sale item has already been added');
            return;
        }
        setError('');
        setItems(current => [...current, {
            ...selected,
            row_id: String(selected.invoice_item_id),
            quantity: String(quantity),
        }]);
        setDraft({ sale_item_id: '', quantity: '1' });
    }

    function updateQuantity(rowId, quantity) {
        setItems(current => current.map(item => item.row_id === rowId ? { ...item, quantity } : item));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!saleId || !items.length || items.some(item =>
            !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1
            || Number(item.quantity) > Number(item.available_quantity)
        )) {
            setError('Select a sale invoice and at least one item with a valid quantity');
            return;
        }
        setSaving(true);
        setError('');
        const formData = new FormData();
        formData.append('payload', JSON.stringify({
            sale_id: Number(saleId),
            return_date: returnDate,
            reason,
            items: items.map(item => ({
                invoice_item_id: Number(item.invoice_item_id),
                quantity: Number(item.quantity),
            })),
        }));
        try {
            const response = await axios.post(
                id ? `sale_return/update.php?id=${id}` : 'sale_return/create.php',
                formData
            );
            if (!response.data?.status) {
                setError(response.data?.message || 'Sale return could not be saved');
                return;
            }
            navigate('/sale-returns');
        } catch (saveError) {
            setError(saveError.response?.data?.message || 'Sale return could not be saved');
        } finally {
            setSaving(false);
        }
    }

    const selectableItems = saleItems.filter(item =>
        Number(item.available_quantity) > 0
        && !items.some(selected => String(selected.invoice_item_id) === String(item.invoice_item_id))
    );
    const total = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0);

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <h3 className="fw-bold mb-3">{id ? 'Edit Sale Return' : 'Create Sale Return'}</h3>
                        <ul className="breadcrumbs mb-3">
                            <li className="nav-item"><Link to="/sale-returns">Sale Returns</Link></li>
                            <li className="separator"><i className="icon-arrow-right"></i></li>
                            <li className="nav-item">{id ? 'Edit' : 'Create'}</li>
                        </ul>
                    </div>
                    <div className="card card-round">
                        <div className="card-body">
                            {loading ? <p>Loading sale return...</p> : (
                                <form onSubmit={handleSubmit}>
                                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                    <div className="row">
                                        <div className="form-group col-md-5">
                                            <label htmlFor="sale_invoice">Sale invoice</label>
                                            <select id="sale_invoice" className="form-control" value={saleId}
                                                onChange={selectSale} required disabled={Boolean(id)}>
                                                <option value="">Select sale invoice</option>
                                                {sales.map(sale => (
                                                    <option key={sale.id} value={sale.id}>
                                                        {sale.invoice_no} - {sale.party_name || 'No customer'} ({sale.invoice_date})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="sale_return_date">Return date</label>
                                            <input id="sale_return_date" type="date" className="form-control"
                                                value={returnDate} onChange={event => setReturnDate(event.target.value)} required />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="sale_return_reason">Reason</label>
                                            <input id="sale_return_reason" className="form-control" value={reason}
                                                maxLength="255" onChange={event => setReason(event.target.value)} />
                                        </div>
                                    </div>
                                    <h5 className="mt-3">Sold items being returned</h5>
                                    <div className="row align-items-end">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="sale_return_item">Sale item</label>
                                            <select id="sale_return_item" className="form-control" value={draft.sale_item_id}
                                                onChange={event => setDraft(current => ({ ...current, sale_item_id: event.target.value }))}>
                                                <option value="">Select medicine</option>
                                                {selectableItems.map(item => (
                                                    <option key={item.invoice_item_id} value={item.invoice_item_id}>
                                                        {item.medicine_name} - remaining {item.available_quantity}, unit price {Number(item.unit_price).toFixed(2)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="sale_return_quantity">Quantity</label>
                                            <input id="sale_return_quantity" type="number" min="1" step="1" className="form-control"
                                                value={draft.quantity} onChange={event => setDraft(current => ({ ...current, quantity: event.target.value }))} />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <button type="button" className="btn btn-secondary mb-3" onClick={addItem}>Add item</button>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead><tr><th>Medicine</th><th>Quantity</th><th>Unit price</th><th>Line total</th><th></th></tr></thead>
                                            <tbody>
                                                {items.map(item => (
                                                    <tr key={item.row_id}>
                                                        <td>{item.medicine_name}</td>
                                                        <td>
                                                            <input aria-label={`Quantity for ${item.medicine_name}`} type="number" min="1"
                                                                max={item.available_quantity} step="1" className="form-control" required
                                                                value={item.quantity} onChange={event => updateQuantity(item.row_id, event.target.value)} />
                                                            <small>Available to return: {item.available_quantity}</small>
                                                        </td>
                                                        <td>{Number(item.unit_price).toFixed(2)}</td>
                                                        <td>{(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}</td>
                                                        <td><button type="button" className="btn btn-sm !bg-gradient-to-br from-[#D60000] to-[#B70000] !text-white border-0 mr-1"
                                                            onClick={() => setItems(current => current.filter(row => row.row_id !== item.row_id))}>Remove</button></td>
                                                    </tr>
                                                ))}
                                                {!items.length && <tr><td colSpan="5" className="text-center">No sale items added</td></tr>}
                                            </tbody>
                                            <tfoot><tr><th colSpan="3" className="text-right">Sale return total</th><th>{total.toFixed(2)}</th><th></th></tr></tfoot>
                                        </table>
                                    </div>
                                    <button type="submit" disabled={saving || !saleId} className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0 mt-3">
                                        {saving ? 'Saving...' : id ? 'Update Sale Return' : 'Save Sale Return'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default SaleReturnCreate;
