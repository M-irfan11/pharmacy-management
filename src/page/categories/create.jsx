import React from 'react';
import Layout from "../Layout.jsx";
import { Link } from 'react-router';
import axios from '../../LIb/axios.js';
function CategoryCreate() {



  // Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let response = await axios.post('category/create.php', formData);

    window.location.href = '/categories';
  };


  return (
    <Layout>
      <div className="page-wrapper">


        <div className="content">

          {/* Page Header */}
          <div className="page-header">
            <h3 className="fw-bold mb-3">Add New Category</h3>

            <ul className="breadcrumbs mb-3">
              <li className="nav-home">
                <a href="#">
                  <i className="icon-home"></i>
                </a>
              </li>

              <li className="separator">
                <i className="icon-arrow-right"></i>
              </li>

              <li className="nav-item">
                <Link to="/categories">Categories</Link>
              </li>
              <li className="separator">
                <i className="icon-arrow-right"></i>
              </li>
              <li className="nav-item">
                <a href="#">Add New</a>
              </li>
            </ul>
          </div>

          {/* Card */}
          <div className="row">
            <div className="col-md-12">
              <div className="card card-round">

                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="categoryName">Category Name</label>
                      <input type="text" name="name" className="form-control" id="categoryName" placeholder="Enter category name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="categoryDescription">Category Description</label>
                      <input type="text" name="description" className="form-control" id="categoryDescription" placeholder="Enter category description" />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Add Category</button>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </Layout>
  );
}

export default CategoryCreate;