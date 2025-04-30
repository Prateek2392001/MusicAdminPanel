import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${api}/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.status === 1) {
        Cookies.set("SuperAdminToken", response.data.token, { expires: 7 });
        navigate("/");
      } else {
        setError("Invalid Email or Password");
      }
    } catch (err) {
      setError("Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-3" style={{ width: "400px" }}>
        <h2 className="text-center text-primary mb-4">🔐 Sign In</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "35px",
                cursor: "pointer",
                color: "#888",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <Link to="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
