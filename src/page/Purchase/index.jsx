import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';

function Purchase() {
    const [purchases, setPurchases] = React.useState([]);
    const [suppliers, setSuppliers] = React.useState([]);
    const [medicines, setMedicines] = React.useState([]);

    const fetchPurchases = async () => {
        try {
            const res = await axios.get('purchase/index.php');
            setPurchases(res.data?.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    React.useEffect(() => {
        fetchPurchases();
        axios.get('supplier/index.php')
            .then(res => setSuppliers(res.data?.data || []))
            .catch(err => console.error('Supplier fetch error:', err));
        axios.get('medicines/index.php')
            .then(res => setMedicines(res.data?.data || []))
            .catch(err => console.error('Medicine fetch error:', err));
    }, []);

    const supplierName = (supplierId) => {
        const s = suppliers.find(x => String(x.id) === String(supplierId));
        return s ? s.supplier_name : supplierId;
    };

    const medicineName = (medicineId) => {
        const medicine = medicines.find(x => String(x.id) === String(medicineId));
        return medicine ? medicine.medicine_name : medicineId;
    };

    async function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this purchase?')) {
            try {
                const res = await axios.delete(`purchase/delete.php?id=${id}`);
                if (res.data?.status) {
                    fetchPurchases();
                } else {
                    alert(res.data?.message || 'Delete failed');
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('Delete failed');
            }
        }
    }

    return (
        <Layout>
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-sm-4 col-3">
                            <h4 className="page-title">Purchases</h4>
                        </div>
                        <div className="col-sm-8 col-9 text-right m-b-20">
                            <Link to="/purchases/create" className="btn btn-primary btn-rounded float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                                <i className="fa fa-plus"></i> Add Purchase
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <table className="table table-border table-striped custom-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Invoice No</th>
                                            <th>Supplier</th>
                                            <th>Medicine</th>
                                            <th>Purchase Date</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchases.length === 0 && (
                                            <tr><td colSpan="9" className="text-center">No purchases found</td></tr>
                                        )}
                                        {purchases.map((purchase, index) => (
                                            <tr key={purchase.id}>
                                                <td>{index + 1}</td>
                                                <td>{purchase.invoice_no}</td>
                                                <td>{supplierName(purchase.supplier_id)}</td>
                                                <td>{medicineName(purchase.medicine_id)}</td>
                                                <td>{purchase.purchase_date}</td>
                                                <td>{purchase.quantity}</td>
                                                <td>{purchase.price}</td>
                                                <td>{purchase.subtotal}</td>
                                                <td className="text-right">
                                                    <Link
                                                        to={`/purchases/edit/${purchase.id}`}
                                                        className="btn btn-sm btn-primary mr-1 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
                                                        title="Edit"
                                                    >
                                                        <i className="fa fa-pencil"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        title="Delete"
                                                        onClick={() => handleDelete(purchase.id)}
                                                    >
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
                </div>
            </div>
        </Layout>
    );
}

export default Purchase;
