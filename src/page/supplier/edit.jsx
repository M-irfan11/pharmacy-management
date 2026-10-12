import React from 'react';
import Layout from "../Layout.jsx";
import { Link } from 'react-router';
import axios from '../../LIb/axios.js';
function SupplierEdit() {



  // Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let response = await axios.post('supplier/edit.php', formData);

    window.location.href = '/categories';
  };

  return (
    <Layout>
      <div className="page-wrapper">
        <div className="content">

          {/* Page Header */}
          <div className="row">
            <div className="col-sm-4 col-3">
              <h4 className="page-title">Edit Supplier</h4>
            </div>
            <div className="col-sm-8 col-9 text-right m-b-20">
              <Link to="/categories" className="btn btn-primary btn-rounded float-right">
                <i className="fa fa-arrow-left"></i> Back
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="supplierName">Supplier Name</label>
                  <input
                    type="text"
                    name="name"
                    id="supplierName"
                    className="form-control"
                    placeholder="Enter supplier name"
                    value={supplier.name || ''}
                    onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="supplierDescription">Supplier Description</label>
                  <input
                    type="text"
                    name="description"
                    id="supplierDescription"
                    className="form-control"
                    placeholder="Enter supplier description"
                    value={supplier.description || ''}
                    onChange={(e) => setSupplier({ ...supplier, description: e.target.value })}
                  />
                </div>

                <div className="m-t-20 text-center">
                  <button type="submit" className="btn btn-primary submit-btn">
                    Update Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>

    </Layout>
  );
}

export default SupplierEdit;