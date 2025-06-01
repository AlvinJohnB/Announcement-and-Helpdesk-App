import React, { useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import TipTapEditor from "../common/TipTapEditor";

const EndorsementForm = ({ refreshEndorsements }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    department: user?.department || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const departments = [
    "Laboratory",
    "Imaging",
    "Reception",
    "Phlebotomy",
    "HK/Messenger",
    "Others",
  ];
  const { title, content, department } = formData;

  React.useEffect(() => {
    if (user?.department) {
      setFormData((prevData) => ({
        ...prevData,
        department: user.department,
      }));
    }
  }, [user?.department]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || title.trim() === "") {
      setMessage({ type: "danger", text: "Title is required" });
      return;
    }
    if (!content || content.trim() === "") {
      setMessage({ type: "danger", text: "Content is required" });
      return;
    }
    if (!department) {
      setMessage({ type: "danger", text: "Department is required" });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      await api.post("/api/endorsements", { ...formData });
      setMessage({ type: "success", text: "Endorsement posted successfully!" });
      setFormData({
        title: "",
        content: "",
        department: user?.department || "",
      });
      if (refreshEndorsements) refreshEndorsements();
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.msg || "Error posting endorsement",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="card shadow border-0 mb-4">
      <div className="card-header bg-dark text-white py-3">
        <h5 className="mb-0 fw-bold">
          <i className="fas fa-thumbs-up me-2"></i>
          Create New Endorsement
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
            <label htmlFor="title" className="form-label fw-semibold">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label fw-semibold">
              Content <span className="text-danger">*</span>
            </label>
            <TipTapEditor
              value={content}
              onChange={handleEditorChange}
              style={{ height: "300px", marginBottom: "50px" }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="department" className="form-label fw-semibold">
              Department
            </label>
            <select
              className="form-select"
              id="department"
              name="department"
              value={department}
              onChange={onChange}
              required
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
                Posting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i> Post Endorsement
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EndorsementForm;
