import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';

function Purchase() {
    const [purchases, setPurchases] = React.useState([]);
    const [suppliers, setSuppliers] = React.useState([]);

    const fetchPurchases = async () => {
        try {
            const response = await axios.get('purchase/index.php');
            if (!response.data?.status && response.data?.message !== 'No records found') {
                throw new Error(response.data?.message || 'Purchases could not be loaded');
            }
            setPurchases(response.data?.data || []);
        } catch (error) {
            console.error('Purchases fetch error:', error);
            alert(error.response?.data?.message || error.message || 'Purchases could not be loaded');
        }
    };

    React.useEffect(() => {
        Promise.resolve().then(fetchPurchases);
        axios.get('supplier/index.php')
            .then(response => setSuppliers(response.data?.data || []))
            .catch(error => {
                console.error('Supplier fetch error:', error);
                alert(error.response?.data?.message || 'Supplier list could not be loaded');
            });
    }, []);

    const supplierName = (supplierId) => {
        const supplier = suppliers.find(row => String(row.id) === String(supplierId));
        return supplier ? supplier.supplier_name : supplierId;
    };

    async function handleDelete(id) {
        if (!window.confirm('Delete this purchase invoice and reverse its stock?')) return;
        try {
            const response = await axios.delete(`purchase/delete.php?id=${id}`);
            if (response.data?.status) {
                await fetchPurchases();
            } else {
                alert(response.data?.message || 'Purchase invoice could not be deleted');
            }
        } catch (error) {
            console.error('Purchase delete error:', error);
            alert(error.response?.data?.message || 'Purchase invoice could not be deleted');
        }
    }

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-sm-4 col-3"><h4 className="page-title">Purchases</h4></div>
                        <div className="col-sm-8 col-9 text-right m-b-20">
                            <Link to="/purchases/create" className="btn btn-primary btn-rounded float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                                <i className="fa fa-plus"></i> Add Purchase
                            </Link>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-border table-striped custom-table mb-0">
                            <thead><tr><th>#</th><th>Invoice No</th><th>Supplier</th><th>Medicines</th><th>Purchase Date</th><th>Total</th><th className="text-right">Action</th></tr></thead>
                            <tbody>
                                {purchases.length === 0 && <tr><td colSpan="7" className="text-center">No purchases found</td></tr>}
                                {purchases.map((purchase, index) => (
                                    <tr key={purchase.id}>
                                        <td>{index + 1}</td>
                                        <td>{purchase.invoice_no}</td>
                                        <td>{supplierName(purchase.supplier_id)}</td>
                                        <td>{(purchase.items || []).map(item => `${item.medicine_name || `Medicine ${item.medicine_id}`} × ${item.quantity}`).join(', ')}</td>
                                        <td>{purchase.purchase_date}</td>
                                        <td>{Number(purchase.total_amount || 0).toFixed(2)}</td>
                                        <td className="text-right">
                                            <Link to={`/purchases/edit/${purchase.id}`} className="btn btn-sm btn-primary mr-1 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0" title="Edit invoice">
                                                <i className="fa fa-pencil"></i>
                                            </Link>
                                            <button className="btn btn-sm btn-danger" title="Delete invoice" onClick={() => handleDelete(purchase.id)}>
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
        </Layout>
    );
}

export default Purchase;
