import React from 'react';
import Layout from "../Layout.jsx";
import { Link, useNavigate, useParams } from 'react-router';
import axios from '../../LIb/axios.js';
function UsersCreate() {

  let { id } = useParams();
  const [users, setUsers] = React.useState({
    'id': '',
    'name': '',
    'mobile': '',
    'email ': '',
    'password': '',
    'status': '',
    
  });

  const fetchUsers = async (e) => {
    let res = await axios.get(`users/single.php?id=${id}`)
    setUsers(res.data.data[0]);
  }

  React.useEffect(() => {
    if (id)
      fetchUsers();
  }, []);


  // Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let url = '';
    if (id) {
      url = `users/update.php?id=${id}`;
    } else {
      url = `users/create.php`;
    }

    let response = await axios.post(url, formData);

    window.location.href = '/users';
  };


  return (
    <Layout>
      <div className="page-wrapper">


        <div className="content">

          {/* Page Header */}
          <div className="page-header">
            <h3 className="fw-bold mb-3">Add New User</h3>

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
                <Link to="/users">Users</Link>
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
                      <label htmlFor="userName">User Name</label>
                      <input type="text" name="name" className="form-control" id="userName" placeholder="Enter user name" value={users.name} onChange={(e) => setUsers({ ...users, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="usersStatus">User Status</label>
                      <input type="text" name="status" className="form-control" id="usersStatus" placeholder="Enter user status" value={users.status} onChange={(e) => setUsers({ ...users, status: e.target.value })} />
                    </div>
                    {id ? (<button type="submit" className="btn btn-primary mt-3 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0 ">Update User</button>) : (<button type="submit" className="btn btn-primary mt-3 !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">Add User</button>)}

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

export default UsersCreate;