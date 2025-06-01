import React, { useState } from "react";
import axios from "axios";

const Register = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    department: "Laboratory",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    username,
    password,
    confirmPassword,
    firstName,
    lastName,
    department,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post("/api/users/register", {
        username,
        password,
        firstName,
        lastName,
        department,
      });

      // Show success message before redirecting
      setError("");
      alert("Registration successful! Please log in.");
      onToggleForm(); // Switch back to login form
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg mt-5">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Register Account</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={username}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength="6"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    required
                    minLength="6"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="department" className="form-label">
                    Department <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="department"
                    name="department"
                    value={department}
                    onChange={onChange}
                    required
                  >
                    <option value="Laboratory">Laboratory</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Reception">Reception</option>
                    <option value="Phlebotomy">Phlebotomy</option>
                    <option value="HK/Messenger">HK/Messenger</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn btn-dark w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Registering...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link text-dark text-decoration-none"
                    onClick={onToggleForm}
                  >
                    Already have an account? Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
