import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';

function Sale() {
    const [sales, setSales] = React.useState([]);
    const [medicines, setMedicines] = React.useState([]);

    const fetchSales = async () => {
        try {
            const res = await axios.get('sale/index.php');
            setSales(res.data?.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    React.useEffect(() => {
        fetchSales();
        axios.get('medicines/index.php')
            .then(res => setMedicines(res.data?.data || []))
            .catch(err => console.error('Medicine fetch error:', err));
    }, []);

    const medicineName = (medicineId) => {
        const medicine = medicines.find(x => String(x.id) === String(medicineId));
        return medicine ? medicine.medicine_name : medicineId;
    };

    async function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            try {
                const res = await axios.delete(`sale/delete.php?id=${id}`);
                if (res.data?.status) {
                    fetchSales();
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
                            <h4 className="page-title">Sales</h4>
                        </div>
                        <div className="col-sm-8 col-9 text-right m-b-20">
                            <Link to="/sales/create" className="btn btn-primary btn-rounded float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                                <i className="fa fa-plus"></i> Add Sale
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
                                            <th>Customer</th>
                                            <th>Medicine</th>
                                            <th>Sale Date</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.length === 0 && (
                                            <tr><td colSpan="9" className="text-center">No sales found</td></tr>
                                        )}
                                        {sales.map((sale, index) => (
                                            <tr key={sale.id}>
                                                <td>{index + 1}</td>
                                                <td>{sale.invoice_no}</td>
                                                <td>{sale.customer_name}</td>
                                                <td>{medicineName(sale.medicine_id)}</td>
                                                <td>{sale.sale_date}</td>
                                                <td>{sale.quantity}</td>
                                                <td>{sale.price}</td>
                                                <td>{sale.subtotal}</td>
                                                <td className="text-right">
                                                    <Link
                                                        to={`/sales/edit/${sale.id}`}
                                                        className="btn btn-sm btn-primary mr-1 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
                                                        title="Edit"
                                                    >
                                                        <i className="fa fa-pencil"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        title="Delete"
                                                        onClick={() => handleDelete(sale.id)}
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

export default Sale;
