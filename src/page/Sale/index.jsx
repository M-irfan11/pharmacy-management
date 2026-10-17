import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';

function Sale() {
    const [sales, setSales] = React.useState([]);

    const fetchSales = async () => {
        try {
            const response = await axios.get('sale/index.php');
            if (!response.data?.status && response.data?.message !== 'No records found') {
                throw new Error(response.data?.message || 'Sales could not be loaded');
            }
            setSales(response.data?.data || []);
        } catch (error) {
            console.error('Sales fetch error:', error);
            alert(error.response?.data?.message || error.message || 'Sales could not be loaded');
        }
    };

    React.useEffect(() => {
        Promise.resolve().then(fetchSales);
    }, []);

    async function handleDelete(id) {
        if (!window.confirm('Delete this sale invoice and restore its stock?')) return;
        try {
            const response = await axios.delete(`sale/delete.php?id=${id}`);
            if (response.data?.status) {
                await fetchSales();
            } else {
                alert(response.data?.message || 'Sale invoice could not be deleted');
            }
        } catch (error) {
            console.error('Sale delete error:', error);
            alert(error.response?.data?.message || 'Sale invoice could not be deleted');
        }
    }

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-sm-4 col-3"><h4 className="page-title">Sales</h4></div>
                        <div className="col-sm-8 col-9 text-right m-b-20">
                            <Link to="/sales/create" className="btn btn-primary btn-rounded float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                                <i className="fa fa-plus"></i> Add Sale
                            </Link>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-border table-striped custom-table mb-0">
                            <thead><tr><th>#</th><th>Invoice No</th><th>Customer</th><th>Medicines</th><th>Sale Date</th><th>Total</th><th className="text-right">Action</th></tr></thead>
                            <tbody>
                                {sales.length === 0 && <tr><td colSpan="7" className="text-center">No sales found</td></tr>}
                                {sales.map((sale, index) => (
                                    <tr key={sale.id}>
                                        <td>{index + 1}</td>
                                        <td>{sale.invoice_no}</td>
                                        <td>{sale.customer_name}</td>
                                        <td>{(sale.items || []).map(item => `${item.medicine_name || `Medicine ${item.medicine_id}`} × ${item.quantity}`).join(', ')}</td>
                                        <td>{sale.sale_date}</td>
                                        <td>{Number(sale.total_amount || 0).toFixed(2)}</td>
                                        <td className="text-right">
                                            <Link to={`/sales/edit/${sale.id}`} className="btn btn-sm btn-primary mr-1 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0" title="Edit invoice">
                                                <i className="fa fa-pencil"></i>
                                            </Link>
                                            <button className="btn btn-sm btn-danger" title="Delete invoice" onClick={() => handleDelete(sale.id)}>
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

export default Sale;
