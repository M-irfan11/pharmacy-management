import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import axios from '../../LIb/axios.js';

function Users() {
  const [users, setUsers] = React.useState([]);

  const fetchUsers = async (e) => {
    let res = await axios.get(`users/index.php`)
    setUsers(res.data.data);
  }

  React.useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      let res = await axios.delete(`users/delete.php?id=${id}`)
      if (res.data.status) {
        fetchUsers();
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
              <h4 className="page-title">Users</h4>
            </div>
            <div className="col-sm-8 col-9 text-right m-b-20">
              <Link
                to="/users/create"
                className="btn btn-primary btn-rounded float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
              >
                <i className="fa fa-plus"></i> Add User
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
                      <th>User Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.mobile}</td>
                        <td>{user.email}</td>
                        <td>{user.status}</td>
                        <td className="text-right">
                          <Link
                            to={`/users/edit/${user.id}`}
                            className="btn btn-sm btn-primary mr-1 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
                            title="Edit"
                          >
                            <i className="fa fa-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-sm !bg-gradient-to-br from-[#D60000] to-[#B70000] !text-white border-0 mr-1"
                            title="Delete"
                            onClick={() => handleDelete(user.id)}
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

export default Users;