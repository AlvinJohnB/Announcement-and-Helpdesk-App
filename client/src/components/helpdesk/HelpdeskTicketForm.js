import React, { useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const HelpdeskTicketForm = ({ refreshTickets }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    department: user?.department || "",
  });
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const priorities = ["low", "medium", "high"];
  const departments = [
    "Laboratory",
    "Imaging",
    "Reception",
    "Phlebotomy",
    "HK/Messenger",
    "Others",
  ];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setDescriptionHtml(value);
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      setMessage({
        type: "danger",
        text: "Subject and description are required.",
      });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      await api.post("/api/endorsements", formData);
      setMessage({ type: "success", text: "Ticket submitted successfully!" });
      setFormData({
        subject: "",
        description: "",
        priority: "medium",
        department: user?.department || "",
      });
      setDescriptionHtml("");
      if (refreshTickets) refreshTickets();
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.msg || "Error submitting ticket",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="card shadow border-0 mb-4">
      <div className="card-header bg-dark text-white py-3">
        <h5 className="mb-0 fw-bold">
          <i className="fas fa-ticket-alt me-2"></i>
          Submit Helpdesk Ticket
        </h5>
      </div>
      <div className="card-body p-4">
        {message && (
          <div
            className={`alert alert-${message.type} d-flex align-items-center`}
          >
            <i
              className={`fas fa-${
                message.type === "success"
                  ? "check-circle"
                  : "exclamation-triangle"
              } me-2`}
            ></i>
            {message.text}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Subject <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="subject"
              value={formData.subject}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Description <span className="text-danger">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={descriptionHtml}
              onChange={handleDescriptionChange}
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              placeholder="Describe your issue. You can paste images here."
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Priority</label>
            <select
              className="form-select"
              name="priority"
              value={formData.priority}
              onChange={onChange}
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Department</label>
            <select
              className="form-select"
              name="department"
              value={formData.department}
              onChange={onChange}
            >
              <option value="" disabled>
                Select a department
              </option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i> Submit Ticket
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpdeskTicketForm;
