import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';

function Categories() {
  const [categories, setCategories] = React.useState([]);

  const fetchCategories = async (e) => {
    let res = await axios.get(`category/index.php`)
    setCategories(res.data.data);
  }

  React.useEffect(() => {
    fetchCategories();
  }, []);

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this category?")) {
      let res = await axios.delete(`category/delete.php?id=${id}`)
      if (res.data.status) {
        fetchCategories();
      } else {
        alert(res.data.message);
      }
    }
  }

  return (
    <Layout>

      <div className="page-wrapper">
        <div className="content">

          {/* Page Header */}
          <div className="row">
            <div className="col-sm-4 col-3">
              <h4 className="page-title">Categories</h4>
            </div>
            <div className="col-sm-8 col-9 text-right m-b-20">
              <Link
                to="/categories/create"
                className="btn btn-primary btn-rounded float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
              >
                <i className="fa fa-plus"></i> Add Category
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-border table-striped custom-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories && categories.map((category, index) => (
                      <tr key={category.id}>
                        <td>{index + 1}</td>
                        <td>{category.name}</td>
                        <td>{category.description}</td>
                        <td className="text-right">
                          <Link
                            to={`/categories/edit/${category.id}`}
                            className="btn btn-sm btn-primary mr-1 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
                            title="Edit"
                          >
                            <i className="fa fa-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-sm !bg-gradient-to-br from-[#D60000] to-[#B70000] !text-white border-0 mr-1"
                            title="Delete"
                            onClick={() => handleDelete(category.id)}
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

export default Categories;