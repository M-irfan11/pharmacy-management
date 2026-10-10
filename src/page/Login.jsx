import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
// import "./Login.css";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    axios
      .post(`${import.meta.env.VITE_API_URL}login.php`, {
        email: form.get("email"),
        password: form.get("password")
      })
      .then((response) => {
        sessionStorage.setItem("access_token", response.data.jwt);
        sessionStorage.setItem("userdata", response.data.data);
        window.location.href='./dashboard';
      })
      .catch(() => {
        setMessage("An error occurred while creating your account. Please try again.");
      });

  }

  return (


<div className="main-wrapper account-wrapper">
        <div className="account-page">
			<div className="account-center">
				<div className="account-box">
                    <form onSubmit={handleSubmit} className="form-signin">
						<div className="account-logo">
                            <Link to="/"><img src="/assets/img/logo-dark.png" alt=""/></Link>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Username or Email</label>
                            <input id="email"
                            name="email"
                            type="text"
                             autoFocus
                              className="form-control"
                              required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input id="password"
                            name="password"
                            type="password"
                             className="form-control"
                              required />
                        </div>
                        <div className="form-group text-right">
                            <Link to="/forgot-password">Forgot your password?</Link>
                        </div>

                        {message && (
                          <div className="form-group text-center text-danger">
                            {message}
                          </div>
                        )}
                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-primary account-btn">Login</button>
                        </div>
                        <div className="text-center register-link">
                            Don’t have an account? <Link to="/register">Register Now</Link>
                        </div>
                    </form>
                </div>
			      </div>
        </div>
    </div>
  ) }
  export default Login