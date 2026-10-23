import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js'; 

function Medicines() {
    const [medicines, setMedicines] = React.useState([]);

    const fetchMedicines = async () => {
        try {
            const res = await axios.get('medicines/index.php');
            setMedicines(res.data?.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    React.useEffect(() => {
        fetchMedicines();
    }, []);

    async function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            const res = await axios.delete(`medicines/delete.php?id=${id}`);
            if (res.data.status) {
                fetchMedicines();
            } else {
                alert(res.data.message);
            }
        }
    }

    return (
        <Layout>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content">
                        <div className="row">
                            <div className="col-sm-4 col-3">
                                <h4 className="page-title">Medicines</h4>
                            </div>
                            <div className="col-sm-8 col-9 text-right m-b-20">
                                <Link to="/medicines/create" className="btn btn-rounded float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                                    <i className="fa fa-plus"></i> Add Medicine
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
                                                <th>Medicine Name</th>
                                                <th>Batch No</th>
                                                <th>Purchase Price</th>
                                                <th>Selling Price</th>
                                                <th>Quantity</th>
                                                <th>Expiry Date</th>
                                                <th className="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {medicines.map((medicine, index) => (
                                                <tr key={medicine.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{medicine.medicine_name}</td>
                                                    <td>{medicine.batch_no}</td>
                                                    <td>{medicine.purchase_price}</td>
                                                    <td>{medicine.selling_price}</td>
                                                    <td>{medicine.stock_qty}</td>
                                                    <td>{medicine.expiry_date}</td>
                                                    <td className="text-right">
                                                        <Link
                                                            to={`/medicines/edit/${medicine.id}`}
                                                            className="btn btn-sm btn-primary mr-1 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
                                                            title="Edit"
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm !bg-gradient-to-br from-[#D60000] to-[#B70000] !text-white border-0 mr-1"
                                                            title="Delete"
                                                            onClick={() => handleDelete(medicine.id)}
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
            </div>
        </Layout>
    );
}

export default Medicines;