import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";

function Categories() {
  const [categories, setCategories] = React.useState([]);

  function fetchCategories() {
    fetch('http://localhost/pharmacy_api/category/index.php')
      .then(response => response.json())
      .then(data => setCategories(data.data))
      .catch(error => console.error('Error fetching categories:', error));
  }

  React.useEffect(() => {
    fetchCategories();
  }, []);

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this categories?')) {
      fetch(`http://localhost/pharmacy_api/category/delete.php?id=${id}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          if (data.status == 'true') {
            fetchCategories();
          }
        })
        .catch(error => console.error('Error deleting categories:', error));
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
                className="btn btn-primary btn-rounded float-right"
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
                    {categories.map((category, index) => (
                      <tr key={category.id}>
                        <td>{index + 1}</td>
                        <td>{category.name}</td>
                        <td>{category.description}</td>
                        <td className="text-right">
                          <Link
                            to={`/categories/edit/${category.id}`}
                            className="btn btn-sm btn-primary mr-1"
                            title="Edit"
                          >
                            <i className="fa fa-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
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