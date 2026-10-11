import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";

function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.target);

    axios
      .post(`${import.meta.env.VITE_API_URL}forgot-password.php`, {
        email: form.get("email"),
      })
      .then((response) => {
        setIsError(false);
        setMessage(response.data.message);
      })
      .catch((error) => {
        setIsError(true);
        setMessage(
          error.response?.data?.message ||
            "An error occurred while processing your request. Please try again."
        );
      })
      .finally(() => setLoading(false));
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
                <label htmlFor="email">Enter Your Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  autoFocus
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
                  {loading ? "Sending..." : "Reset Password"}
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

export default ForgotPassword;