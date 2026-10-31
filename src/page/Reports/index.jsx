import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../Layout.jsx';
import axios from '../../LIb/axios.js';

const money = (value) => Number(value || 0).toFixed(2);
const inDateRange = (value, fromDate, toDate) => {
    if (!value) return true;
    if (fromDate && value < fromDate) return false;
    if (toDate && value > toDate) return false;
    return true;
};

function Reports() {
    const [activeTab, setActiveTab] = useState('purchase');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [search, setSearch] = useState('');
    const [lowStockLimit, setLowStockLimit] = useState('10');
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);
    const [purchaseReturns, setPurchaseReturns] = useState([]);
    const [saleReturns, setSaleReturns] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const loadReport = async () => {
            if (!active) return;
            try {
                setLoading(true);
                const response = await axios.get('reports/index.php?action=all');
                if (!response.data?.status) throw new Error(response.data?.message || 'Report data could not be loaded');
                const data = response.data.data || {};
                setPurchases(data.purchases || []);
                setSales(data.sales || []);
                setPurchaseReturns(data.purchase_returns || []);
                setSaleReturns(data.sale_returns || []);
                setMedicines(data.medicines || []);
                setError('');
            } catch (loadError) {
                if (active) setError(loadError.response?.data?.message || loadError.message || 'Report data could not be loaded');
            } finally {
                if (active) setLoading(false);
            }
        };

        loadReport();
        const intervalId = window.setInterval(loadReport, 30000);
        window.addEventListener('focus', loadReport);
        return () => {
            active = false;
            window.clearInterval(intervalId);
            window.removeEventListener('focus', loadReport);
        };
    }, []);

    const searchText = search.trim().toLowerCase();
    const purchaseRows = useMemo(() => {
        const rows = [];
        purchases.forEach((invoice) => (invoice.items || []).forEach((item) => rows.push({
            id: `${invoice.id}-${item.id || item.medicine_id}`,
            date: invoice.purchase_date,
            document: invoice.invoice_no,
            party: '',
            medicine: item.medicine_name || `Medicine ${item.medicine_id}`,
            quantity: Number(item.quantity || 0),
            price: Number(item.unit_price || 0),
            amount: Number(item.line_total || Number(item.quantity || 0) * Number(item.unit_price || 0)),
        })));
        return rows.filter((row) => inDateRange(row.date, fromDate, toDate) && (!searchText || `${row.document} ${row.party} ${row.medicine}`.toLowerCase().includes(searchText)));
    }, [purchases, fromDate, toDate, searchText]);

    const saleRows = useMemo(() => {
        const rows = [];
        sales.forEach((invoice) => (invoice.items || []).forEach((item) => rows.push({
            id: `${invoice.id}-${item.id || item.medicine_id}`,
            date: invoice.sale_date,
            document: invoice.invoice_no,
            party: invoice.customer_name || '',
            medicine: item.medicine_name || `Medicine ${item.medicine_id}`,
            quantity: Number(item.quantity || 0),
            price: Number(item.unit_price || 0),
            amount: Number(item.line_total || Number(item.quantity || 0) * Number(item.unit_price || 0)),
        })));
        return rows.filter((row) => inDateRange(row.date, fromDate, toDate) && (!searchText || `${row.document} ${row.party} ${row.medicine}`.toLowerCase().includes(searchText)));
    }, [sales, fromDate, toDate, searchText]);

    const returnRows = useMemo(() => {
        const rows = [];
        [...purchaseReturns.map((item) => ({ type: 'Purchase Return', source: item })), ...saleReturns.map((item) => ({ type: 'Sale Return', source: item }))]
            .forEach(({ type, source }) => (source.items || []).forEach((item) => rows.push({
                id: `${type}-${source.id}-${item.id || item.medicine_id}`,
                type,
                date: source.return_date,
                document: source.return_no,
                party: source.party_name || '',
                invoice: source.invoice_no || '',
                medicine: item.medicine_name || `Medicine ${item.medicine_id}`,
                quantity: Number(item.quantity || 0),
                price: Number(item.unit_price || 0),
                amount: Number(item.line_total || Number(item.quantity || 0) * Number(item.unit_price || 0)),
            })));
        return rows.filter((row) => inDateRange(row.date, fromDate, toDate) && (!searchText || `${row.type} ${row.document} ${row.invoice} ${row.party} ${row.medicine}`.toLowerCase().includes(searchText)));
    }, [purchaseReturns, saleReturns, fromDate, toDate, searchText]);

    const stockRows = useMemo(() => medicines.filter((medicine) => {
        const limit = Math.max(0, Number(lowStockLimit || 0));
        const matchesTab = !searchText || `${medicine.medicine_name} ${medicine.batch_no || ''}`.toLowerCase().includes(searchText);
        return matchesTab && (!lowStockLimit || Number(medicine.stock_qty || 0) <= limit);
    }), [medicines, searchText, lowStockLimit]);

    const totalFor = (rows) => rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const summary = activeTab === 'stock'
        ? { label1: 'Medicines', value1: stockRows.length, label2: 'Low Stock', value2: stockRows.length, label3: 'Stock Quantity', value3: stockRows.reduce((sum, row) => sum + Number(row.stock_qty || 0), 0) }
        : activeTab === 'purchase'
            ? { label1: 'Items', value1: purchaseRows.length, label2: 'Quantity', value2: purchaseRows.reduce((sum, row) => sum + row.quantity, 0), label3: 'Total Purchase', value3: totalFor(purchaseRows) }
            : activeTab === 'sale'
                ? { label1: 'Items', value1: saleRows.length, label2: 'Quantity', value2: saleRows.reduce((sum, row) => sum + row.quantity, 0), label3: 'Total Sales', value3: totalFor(saleRows) }
                : { label1: 'Return Lines', value1: returnRows.length, label2: 'Quantity', value2: returnRows.reduce((sum, row) => sum + row.quantity, 0), label3: 'Return Amount', value3: totalFor(returnRows) };

    const exportCsv = () => {
        let headers = [];
        let rows = [];
        if (activeTab === 'purchase') { headers = ['Date','Invoice','Medicine','Quantity','Unit Price','Amount']; rows = purchaseRows.map((r) => [r.date,r.document,r.medicine,r.quantity,r.price,r.amount]); }
        if (activeTab === 'sale') { headers = ['Date','Invoice','Customer','Medicine','Quantity','Unit Price','Amount']; rows = saleRows.map((r) => [r.date,r.document,r.party,r.medicine,r.quantity,r.price,r.amount]); }
        if (activeTab === 'return') { headers = ['Date','Type','Return No','Invoice','Party','Medicine','Quantity','Unit Price','Amount']; rows = returnRows.map((r) => [r.date,r.type,r.document,r.invoice,r.party,r.medicine,r.quantity,r.price,r.amount]); }
        if (activeTab === 'stock') { headers = ['Medicine','Batch No','Purchase Price','Selling Price','Stock Qty','Expiry Date']; rows = stockRows.map((r) => [r.medicine_name,r.batch_no || '',r.purchase_price,r.selling_price,r.stock_qty,r.expiry_date]); }
        const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pharmacy-${activeTab}-report.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const renderValue = (value, isMoney = false) => isMoney ? money(value) : value;

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="content">
                    <div className="row mb-3">
                        <div className="col-sm-6"><h4 className="page-title">Core Reports</h4></div>
                        <div className="col-sm-6 text-right">
                            <button type="button" className="btn btn-secondary mr-1" onClick={() => window.print()}><i className="fa fa-print"></i> Print</button>
                            <button type="button" className="btn btn-success" onClick={exportCsv}><i className="fa fa-file-excel-o"></i> Export CSV</button>
                        </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3"><label>From Date</label><input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
                                <div className="col-md-3"><label>To Date</label><input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
                                <div className="col-md-4"><label>Search</label><input type="search" className="form-control" placeholder="Invoice, medicine, party..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                                {activeTab === 'stock' && <div className="col-md-2"><label>Low Stock ≤</label><input type="number" min="0" className="form-control" value={lowStockLimit} onChange={(e) => setLowStockLimit(e.target.value)} /></div>}
                            </div>
                        </div>
                    </div>
                    <ul className="nav nav-tabs mb-3">
                        {[['purchase','Purchase'],['sale','Sales'],['return','Returns'],['stock','Medicine Stock']].map(([key,label]) => (
                            <li className="nav-item" key={key}><button type="button" className={`nav-link ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button></li>
                        ))}
                    </ul>
                    <div className="row">
                        {[{label:summary.label1,value:summary.value1,money:false},{label:summary.label2,value:summary.value2,money:false},{label:summary.label3,value:summary.value3,money:typeof summary.value3 === 'number' && summary.label3 !== 'Stock Quantity'}].map((card) => (
                            <div className="col-md-4" key={card.label}><div className="card mb-3"><div className="card-body"><small className="text-muted">{card.label}</small><h4>{renderValue(card.value, card.money)}</h4></div></div></div>
                        ))}
                    </div>
                    {loading ? <div className="text-center p-4">Loading report...</div> : (
                        <div className="table-responsive">
                            {activeTab === 'stock' ? (
                                <table className="table table-striped custom-table mb-0"><thead><tr><th>#</th><th>Medicine</th><th>Batch No</th><th>Purchase Price</th><th>Selling Price</th><th>Stock</th><th>Expiry Date</th></tr></thead><tbody>
                                    {!stockRows.length && <tr><td colSpan="7" className="text-center">No medicines found</td></tr>}
                                    {stockRows.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td>{row.medicine_name}</td><td>{row.batch_no || '-'}</td><td>{money(row.purchase_price)}</td><td>{money(row.selling_price)}</td><td><span className={Number(row.stock_qty) <= Math.max(0, Number(lowStockLimit || 0)) ? 'badge badge-danger' : ''}>{row.stock_qty}</span></td><td>{row.expiry_date || '-'}</td></tr>)}
                                </tbody></table>
                            ) : activeTab === 'return' ? (
                                <table className="table table-striped custom-table mb-0"><thead><tr><th>#</th><th>Date</th><th>Type</th><th>Return No</th><th>Invoice</th><th>Party</th><th>Medicine</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>
                                    {!returnRows.length && <tr><td colSpan="10" className="text-center">No returns found</td></tr>}
                                    {returnRows.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td>{row.date}</td><td>{row.type}</td><td>{row.document}</td><td>{row.invoice}</td><td>{row.party || '-'}</td><td>{row.medicine}</td><td>{row.quantity}</td><td>{money(row.price)}</td><td>{money(row.amount)}</td></tr>)}
                                </tbody></table>
                            ) : activeTab === 'purchase' ? (
                                <table className="table table-striped custom-table mb-0"><thead><tr><th>#</th><th>Date</th><th>Invoice</th><th>Medicine</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>
                                    {!purchaseRows.length && <tr><td colSpan="7" className="text-center">No purchases found</td></tr>}
                                    {purchaseRows.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td>{row.date}</td><td>{row.document}</td><td>{row.medicine}</td><td>{row.quantity}</td><td>{money(row.price)}</td><td>{money(row.amount)}</td></tr>)}
                                </tbody></table>
                            ) : (
                                <table className="table table-striped custom-table mb-0"><thead><tr><th>#</th><th>Date</th><th>Invoice</th><th>Customer</th><th>Medicine</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>
                                    {!saleRows.length && <tr><td colSpan="8" className="text-center">No sales found</td></tr>}
                                    {saleRows.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td>{row.date}</td><td>{row.document}</td><td>{row.party || '-'}</td><td>{row.medicine}</td><td>{row.quantity}</td><td>{money(row.price)}</td><td>{money(row.amount)}</td></tr>)}
                                </tbody></table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Reports;
