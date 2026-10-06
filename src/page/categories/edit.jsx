import React from 'react';
import { Link, useParams } from 'react-router';

function CategoryEdit() {
  const { id } = useParams();

  const [category, setCategory] = React.useState({});

  function fetchCategory() {
    fetch('http://localhost/fnf_api/category/single.php?id=' + id)
      .then(response => response.json())
      .then(data => setCategory(data.data[0]))
      .catch(error => console.error('Error fetching category:', error));
  }

  React.useEffect(() => {
    fetchCategory();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    fetch('http://localhost/fnf_api/category/update.php?id=' + category.id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        window.location.href = '/categories';
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  return (
    <div className="main-wrapper">
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
    </div>
  );
}

export default CategoryEdit;