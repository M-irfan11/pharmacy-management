import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import axios from "axios";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const form = new FormData(event.target);
    const password = form.get("password");
    const confirm = form.get("confirm_password");

    if (password.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirm) {
      setIsError(true);
      setMessage("entered passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_API_URL}reset-password.php`, {
        token,
        password,
      })
      .then((response) => {
        setIsError(false);
        setMessage(response.data.message);
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((error) => {
        setIsError(true);
        setMessage(
          error.response?.data?.message ||
            "password reset failed. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }

  if (!token) {
    return (
      <div className="main-wrapper account-wrapper">
        <div className="account-page">
          <div className="account-center">
            <div className="account-box">
              <div className="text-center text-danger">
                Link is invalid or has expired. Please request a new password reset link.
              </div>
              <div className="text-center register-link">
                <Link to="/forgot-password">Forgot Password</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper account-wrapper">
      <div className="account-page">
        <div className="account-center">
          <div className="account-box">
            <form onSubmit={handleSubmit} className="form-signin">
              <div className="account-logo">
                <Link to="/">
                  <img src="/assets/img/logo-dark.png" alt="" />
                </Link>
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">Confirm Password</label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  className="form-control"
                  required
                />
              </div>

              {message && (
                <div
                  className={`form-group text-center ${
                    isError ? "text-danger" : "text-success"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="form-group text-center">
                <button
                  className="btn btn-primary account-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Change Password"}
                </button>
              </div>

              <div className="text-center register-link">
                <Link to="/login">Back to Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;