import React, {useState} from 'react';
import Layout from "../Layout.jsx";
import { Link } from 'react-router';
import axios from '../../LIb/axios.js';
function UsersEdit() {
  const[users, setUsers] = useState({name: '', status: ''});
  // Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let response = await axios.post('users/update.php', formData);

    window.location.href = '/users';
  };

  return (
    <Layout>
      <div className="page-wrapper">
        <div className="content">

          {/* Page Header */}
          <div className="row">
            <div className="col-sm-4 col-3">
              <h4 className="page-title">Edit User</h4>
            </div>
            <div className="col-sm-8 col-9 text-right m-b-20">
              <Link to="/categories" className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0 btn-rounded float-right">
                <i className="fa fa-arrow-left"></i> Back
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={window.location.pathname.split('/').filter(Boolean).pop()} />
                <div className="form-group">
                  <label htmlFor="userName">User Name</label>
                  <input
                    type="text"
                    name="name"
                    id="userName"
                    className="form-control"
                    placeholder="Enter user name"
                    value={users.name || ''}
                    onChange={(e) => setUsers({ ...users, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="usersStatus">User Status</label>
                  <input
                    type="text"
                    name="status"
                    id="usersStatus"
                    className="form-control"
                    placeholder="Enter user status"
                    value={users.status || ''}
                    onChange={(e) => setUsers({ ...users, status: e.target.value })}
                  />
                </div>

                <div className="m-t-20 text-center">
                  <button type="submit" className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0 submit-btn">
                    Update User
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

export default UsersEdit;