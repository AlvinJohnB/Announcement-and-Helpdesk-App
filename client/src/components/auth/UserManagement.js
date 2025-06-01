import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user",
    department: "Laboratory",
  });
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`/api/users/${editingUser._id}`, formData);
      } else {
        await axios.post("/api/users", formData);
      }
      fetchUsers();
      setFormData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "user",
        department: "Laboratory",
      });
      setEditingUser(null);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/users/${userId}`);
        fetchUsers();
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await axios.put(`/api/users/${user._id}`, {
        ...user,
        active: !user.active,
      });
      fetchUsers();
    } catch (err) {
      setError("Failed to update user status");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title h5 mb-3">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    disabled={editingUser}
                  />
                </div>
                {!editingUser && (
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>{" "}
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="it">IT</option>
                    {user?.role === "superadmin" && (
                      <option value="superadmin">Super Admin</option>
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="Laboratory">Laboratory</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Reception">Reception</option>
                    <option value="Phlebotomy">Phlebotomy</option>
                    <option value="HK/Messenger">HK/Messenger</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? "Update User" : "Add User"}
                  </button>
                  {editingUser && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingUser(null);
                        setFormData({
                          username: "",
                          password: "",
                          firstName: "",
                          lastName: "",
                          role: "user",
                          department: "Laboratory",
                        });
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title h5 mb-3">User List</h3>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.username}</td>
                        <td>{user.department}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              user.role === "admin" ? "danger" : "primary"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={user.active}
                              onChange={() => toggleUserStatus(user)}
                            />
                            <label className="form-check-label">
                              {user.active ? "Active" : "Inactive"}
                            </label>
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
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
    </div>
  );
};

export default UserManagement;
