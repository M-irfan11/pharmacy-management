import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Layout from "../Layout.jsx";
import api from "../../LIb/axios.js";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("employees/index.php")
      .then((response) => {
        if (!response.data?.status) {
          throw new Error(response.data?.message || "Could not load employees.");
        }
        if (active) setEmployees(response.data.data || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter((employee) =>
      [employee.employee_code, employee.full_name, employee.phone, employee.nid_number]
        .some((value) => String(value || "").toLowerCase().includes(query)),
    );
  }, [employees, search]);

  async function deleteEmployee(employee) {
    if (!window.confirm(`Delete ${employee.full_name}?`)) return;
    setError("");
    try {
      const response = await api.delete(`employees/delete.php?id=${employee.id}`);
      if (!response.data?.status) {
        throw new Error(response.data?.message || "Could not delete employee.");
      }
      setEmployees((current) => current.filter((row) => row.id !== employee.id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  }

  return (
    <Layout>
      <div className="page-wrapper">
        <div className="content">
          <div className="row align-items-center mb-3">
            <div className="col-sm-6">
              <h4 className="page-title">Employees</h4>
            </div>
            <div className="col-sm-6 text-right">
              <Link to="/employees/create" className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">
                <i className="fa fa-plus mr-1" /> Add Employee
              </Link>
            </div>
          </div>
          <div className="card card-round">
            <div className="card-body">
              <div className="form-group">
                <input
                  className="form-control"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by code, name, phone or NID"
                  aria-label="Search employees"
                />
              </div>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <div className="table-responsive">
                <table className="table table-striped custom-table mb-0">
                  <thead>
                    <tr>
                      <th>SL No</th><th>Name</th><th>Phone</th><th>NID</th>
                      <th>Designation</th><th>Basic Salary</th><th>Join Date</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="9" className="text-center">Loading...</td></tr>
                    ) : filteredEmployees.length ? filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.employee_code}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            className="rounded-circle mr-2"
                            src={employee.photo_path || employee.image || "/assets/img/user00.jpg"}
                            alt=""
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = "/assets/img/user00.jpg";
                            }}
                            style={{ width: 40, height: 40, objectFit: "cover" }}
                          />
                          <span>{employee.full_name}</span>
                          </div>
                        </td>
                        <td>{employee.phone}</td>
                        <td>{employee.nid_number}</td>
                        <td>{employee.designation || "-"}</td>
                        <td>{employee.basic_salary ?? "-"}</td>
                        {/* <td>{employee.department || "-"}</td> */}
                        <td>{employee.join_date || "-"}</td>
                        <td>{employee.status}</td>
                        <td className="text-nowrap">
                          <Link className="btn btn-sm !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0 mr-1" to={`/employees/edit/${employee.id}`} aria-label={`Edit ${employee.full_name}`}>
                            <i className="fa fa-pencil" />
                          </Link>
                          <button className="btn btn-sm !bg-gradient-to-br from-[#D60000] to-[#B70000] !text-white border-0 mr-1" type="button" onClick={() => deleteEmployee(employee)} aria-label={`Delete ${employee.full_name}`}>
                            <i className="fa fa-trash-o" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="9" className="text-center">No employees found.</td></tr>
                    )}
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

export default Employees;
