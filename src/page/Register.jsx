import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/?$/, "/");

  function showMessage(text, error = false) {
    setMessage(text);
    setIsError(error);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formElement = event.target;
    const form = new FormData(formElement);

    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      showMessage("Your passwords do not match. Please try again.", true);
      formElement.elements.confirmPassword.focus();
      return;
    }

    setLoading(true);
    showMessage("");

    axios
      .post(`${apiUrl}register.php`, {
        name: form.get("name"),
        email: form.get("email"),
        password: password,
        mobile: form.get("mobile"),
      })
      .then(() => {
        showMessage("Account created successfully. Redirecting to login...");
        formElement.reset();
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch((err) => {
        const serverMessage = err.response?.data?.message;
        showMessage(
          serverMessage ||
            "An error occurred while creating your account. Please try again.",
          true
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
                  <img src="assets/img/logo-dark.png" alt="Logo" />
                </Link>
              </div>

              {message && (
                <div
                  className={`alert ${isError ? "alert-danger" : "alert-success"}`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="register_name">Username</label>
                <input
                  id="register_name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="name"
                  minLength={2}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register_email">Email Address</label>
                <input
                  id="register_email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register_password">Password</label>
                <input
                  id="register_password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  minLength={6}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register_confirm_password">Confirm Password</label>
                <input
                  id="register_confirm_password"
                  name="confirmPassword"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="form-control"
                  required
                />
                <button
                  type="button"
                  className="btn btn-link p-0 mt-1"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  aria-pressed={passwordVisible}
                  onClick={() => setPasswordVisible((v) => !v)}
                >
                  {passwordVisible ? "Hide password" : "Show password"}
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="register_mobile">Mobile Number</label>
                <input
                  id="register_mobile"
                  name="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  autoComplete="tel"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group checkbox">
                <label htmlFor="register_terms">
                  <input
                    id="register_terms"
                    name="terms"
                    type="checkbox"
                    required
                  />{" "}
                  I have read and agree the Terms &amp; Conditions
                </label>
              </div>

              <div className="form-group text-center">
                <button
                  className="btn btn-primary account-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Signup"}
                </button>
              </div>

              <div className="text-center login-link">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;