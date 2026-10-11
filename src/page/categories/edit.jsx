import React from 'react';
import Layout from "../Layout.jsx";
import { Link } from 'react-router';
import axios from '../../LIb/axios.js';
function CategoryEdit() {



  // Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let response = await axios.post('category/edit.php', formData);

    window.location.href = '/categories';
  };

  return (
    <Layout>
      <div className="page-wrapper">
        <div className="content">

          {/* Page Header */}
          <div className="row">
            <div className="col-sm-4 col-3">
              <h4 className="page-title">Edit Category</h4>
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
                  <label htmlFor="categoryName">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    id="categoryName"
                    className="form-control"
                    placeholder="Enter category name"
                    value={category.name || ''}
                    onChange={(e) => setCategory({ ...category, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoryDescription">Category Description</label>
                  <input
                    type="text"
                    name="description"
                    id="categoryDescription"
                    className="form-control"
                    placeholder="Enter category description"
                    value={category.description || ''}
                    onChange={(e) => setCategory({ ...category, description: e.target.value })}
                  />
                </div>

                <div className="m-t-20 text-center">
                  <button type="submit" className="btn btn-primary submit-btn">
                    Update Category
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

export default CategoryEdit;