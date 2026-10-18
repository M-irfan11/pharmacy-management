import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import Layout from '../Layout.jsx';
import axios from '../../LIb/axios.js';

function SaleReturns() {
    const [returns, setReturns] = useState([]);
    const [error, setError] = useState('');

    const loadReturns = useCallback(() => axios.get('sale_return/index.php'), []);

    const fetchReturns = useCallback(async () => {
        try {
            const response = await loadReturns();
            if (!response.data?.status) throw new Error(response.data?.message || 'Sale returns could not be loaded');
            setReturns(response.data.data || []);
            setError('');
        } catch (loadError) {
            setError(loadError.response?.data?.message || loadError.message || 'Sale returns could not be loaded');
        }
    }, [loadReturns]);

    useEffect(() => {
        let active = true;
        loadReturns().then(response => {
            if (!active) return;
            if (!response.data?.status) {
                setError(response.data?.message || 'Sale returns could not be loaded');
                return;
            }
            setReturns(response.data.data || []);
            setError('');
        }).catch(loadError => {
            if (active) setError(loadError.response?.data?.message || loadError.message || 'Sale returns could not be loaded');
        });
        return () => { active = false; };
    }, [loadReturns]);

    async function handleDelete(item) {
        if (!window.confirm(`Delete sale return ${item.return_no}? Inventory will be adjusted.`)) return;
        try {
            const response = await axios.delete(`sale_return/delete.php?id=${item.id}`);
            if (!response.data?.status) {
                setError(response.data?.message || 'Sale return could not be deleted');
                return;
            }
            await fetchReturns();
        } catch (deleteError) {
            setError(deleteError.response?.data?.message || 'Sale return could not be deleted');
        }
    }

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-sm-6"><h4 className="page-title">Sale Returns</h4></div>
                        <div className="col-sm-6 text-right m-b-20">
                            <Link to="/sale-returns/create" className="btn btn-primary btn-rounded">Create sale return</Link>
                        </div>
                    </div>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <div className="table-responsive">
                        <table className="table table-border table-striped custom-table mb-0">
                            <thead><tr><th>#</th><th>Return No</th><th>Sale invoice</th><th>Customer</th>
                                <th>Medicines</th><th>Return Date</th><th>Total</th><th>Reason</th><th>Action</th></tr></thead>
                            <tbody>
                                {!returns.length && <tr><td colSpan="9" className="text-center">No sale returns found</td></tr>}
                                {returns.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.return_no}</td>
                                        <td>{item.invoice_no}</td>
                                        <td>{item.party_name || '-'}</td>
                                        <td>{(item.items || []).map(line =>
                                            `${line.medicine_name || `Medicine ${line.medicine_id}`} × ${line.quantity}`
                                        ).join(', ')}</td>
                                        <td>{item.return_date}</td>
                                        <td>{Number(item.total || 0).toFixed(2)}</td>
                                        <td>{item.reason || '-'}</td>
                                        <td className="text-nowrap">
                                            <Link to={`/sale-returns/edit/${item.id}`} className="btn btn-sm btn-primary mr-1" title="Edit sale return">
                                                <i className="fa fa-pencil"></i>
                                            </Link>
                                            <button type="button" className="btn btn-sm btn-danger" title="Delete sale return"
                                                onClick={() => handleDelete(item)}>
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

export default SaleReturns;
