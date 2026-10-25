import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Layout from "../Layout.jsx";
import api from "../../LIb/axios.js";

const emptyEmployee = {
  employee_code: "",
  full_name: "",
  phone: "",
  nid_number: "",
  designation: "",
  // department: "",
  basic_salary: "",
  join_date: "",
  status: "Active",
};

function EmployeeForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(emptyEmployee);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(employee.photo_path || "");
      return undefined;
    }
    const previewUrl = URL.createObjectURL(photo);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [employee.photo_path, photo]);

  useEffect(() => {
    if (!editing) return undefined;
    let active = true;
    api.get(`employees/single.php?id=${id}`)
      .then((response) => {
        if (!response.data?.status || !response.data.data) {
          throw new Error(response.data?.message || "Employee was not found.");
        }
        if (active) setEmployee({ ...emptyEmployee, ...response.data.data });
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
  }, [editing, id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData();
    Object.entries(employee).forEach(([key, value]) => form.set(key, value ?? ""));
    if (photo) form.set("photo", photo);

    try {
      const response = editing
        ? await api.post(`employees/update.php?id=${id}`, form)
        : await api.post("employees/create.php", form);
      if (!response.data?.status) {
        throw new Error(response.data?.message || "Could not save employee.");
      }
      navigate("/employees");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setEmployee((current) => ({ ...current, [name]: value }));
  }

  return (
    <Layout>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <h3 className="fw-bold mb-3">{editing ? "Edit Employee" : "Add Employee"}</h3>
            <Link to="/employees">Back to Employees</Link>
          </div>
          <div className="card card-round">
            <div className="card-body">
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {loading ? <p>Loading employee...</p> : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {[
                      ["employee_code", "Employee Code", 30],
                      ["full_name", "Full Name", 150],
                      ["phone", "Phone", 20],
                      ["nid_number", "NID Number", 30],
                      ["designation", "Designation", 100],
                      // ["department", "Department", 100],
                    ].map(([name, label, maxLength]) => (
                      <div className="col-md-6" key={name}>
                        <div className="form-group">
                          <label htmlFor={name}>{label}{["employee_code", "full_name", "phone", "nid_number"].includes(name) ? " *" : ""}</label>
                          <input
                            className="form-control"
                            id={name}
                            name={name}
                            value={employee[name] || ""}
                            onChange={updateField}
                            maxLength={maxLength}
                            required={["employee_code", "full_name", "phone", "nid_number"].includes(name)}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="basic_salary">Basic Salary</label>
                        <input
                          className="form-control"
                          id="basic_salary"
                          name="basic_salary"
                          type="number"
                          min="0"
                          step="0.01"
                          value={employee.basic_salary ?? ""}
                          onChange={updateField}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="join_date">Join Date</label>
                        <input className="form-control" id="join_date" name="join_date" type="date" value={employee.join_date || ""} onChange={updateField} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select className="form-control" id="status" name="status" value={employee.status || "Active"} onChange={updateField}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="photo">Photo</label>
                        <input className="form-control" id="photo" type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
                        {employee.photo_path && <small className="form-text text-muted">Existing photo is kept unless you choose a new one.</small>}
                        {photoPreview && (
                          <img
                            className="mt-2 rounded"
                            src={photoPreview}
                            alt="Employee profile preview"
                            style={{ width: 96, height: 96, objectFit: "cover" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0 mr-2" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Employee"}
                  </button>
                  <Link className="btn !bg-gradient-to-br from-[#D60000] to-[#B70000] !text-white border-0 " to="/employees">Cancel</Link>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EmployeeForm;
