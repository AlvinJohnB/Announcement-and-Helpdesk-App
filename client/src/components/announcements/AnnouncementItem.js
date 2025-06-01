import React, { useState } from "react";
import DOMPurify from "dompurify";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import TipTapEditor from "../common/TipTapEditor";

// Accept departments as a prop or fallback to default
const DEFAULT_DEPARTMENTS = [
  { name: "Laboratory", color: "primary", accent: "#0d6efd" },
  { name: "Imaging", color: "info", accent: "#0dcaf0" },
  { name: "Reception", color: "success", accent: "#198754" },
  { name: "Phlebotomy", color: "danger", accent: "#dc3545" },
  { name: "HK/Messenger", color: "warning", accent: "#ffc107" },
  { name: "Others", color: "secondary", accent: "#6c757d" },
];

const AnnouncementItem = ({
  announcement,
  onUpdate,
  departments = DEFAULT_DEPARTMENTS,
}) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(announcement.content);
  const [isArchiving, setIsArchiving] = useState(false);
  const [editedTitle, setEditedTitle] = useState(announcement.title);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Build lookup maps for badge color and accent
  const badgeColorMap = Object.fromEntries(
    departments.map((d) => [d.name, d.color])
  );
  const accentMap = Object.fromEntries(
    departments.map((d) => [d.name, d.accent])
  );

  const getBadgeColor = (department) =>
    badgeColorMap[department] || "secondary";
  const getCardAccent = (department) =>
    accentMap[department] || accentMap["Others"] || "#6c757d";

  // Sanitize HTML content
  const createSanitizedHTML = (content) => {
    return {
      __html: DOMPurify.sanitize(content),
    };
  };
  const canEdit =
    user &&
    (user.role === "superadmin" ||
      announcement.authorId === user._id ||
      (user.department === announcement.department && user.role === "admin"));

  const canDelete = user && user.role === "superadmin";
  const canArchive =
    user &&
    (user.role === "superadmin" ||
      user.role === "it" ||
      (user.role === "admin" && user.department === announcement.department));

  const handleArchiveToggle = async () => {
    try {
      setIsArchiving(true);
      const response = await axios.put(
        `/api/announcements/${announcement._id}/archive`
      );
      if (response.data) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error("Error toggling archive status:", error);
      alert(error.response?.data?.msg || "Error updating archive status");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `/api/announcements/${announcement._id}/comments`,
        {
          content: comment,
        }
      );
      announcement.comments = response.data.comments;
      setComment("");
      onUpdate(announcement);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
    setIsSubmitting(false);
  };
  const handleEdit = async () => {
    if (!editMode) {
      setEditMode(true);
      setEditedTitle(announcement.title);
      setEditedContent(announcement.content);
      return;
    }

    // Check if the title or content is empty
    const isContentEmpty = !editedContent || editedContent.trim() === "";
    const isTitleEmpty = !editedTitle || editedTitle.trim() === "";

    if (isContentEmpty || isTitleEmpty) {
      alert("Title and content are required");
      return;
    }

    try {
      const response = await axios.put(
        `/api/announcements/${announcement._id}`,
        {
          title: editedTitle,
          content: editedContent,
          department: announcement.department,
        }
      );

      if (response.data) {
        setEditMode(false);
        // Make sure we update with the data returned from server
        onUpdate(response.data);
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Error updating announcement:", error);
      alert(
        error.response?.data?.msg ||
          error.message ||
          "Error updating announcement"
      );
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this announcement? This action cannot be undone."
      )
    )
      return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/announcements/${announcement._id}`);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.msg || "Error deleting announcement");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="card mb-4 border-0 shadow-sm hover-shadow transition-all"
      style={{
        borderLeft: `4px solid ${getCardAccent(announcement.department)}`,
        borderRadius: "0.5rem",
        opacity: announcement.isArchived ? 0.8 : 1,
      }}
    >
      <div className={`card-body ${editMode ? "pb-5" : ""}`}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex gap-2">
              <span
                className={`badge bg-${getBadgeColor(
                  announcement.department
                )} bg-opacity-75 rounded-pill px-3`}
                title="Department"
              >
                <i className="fas fa-building me-1"></i>
                {announcement.department}
              </span>
              {announcement.isArchived && (
                <span
                  className="badge bg-secondary bg-opacity-75 rounded-pill px-3"
                  title="Archived"
                >
                  <i className="fas fa-archive me-1"></i>
                  Archived
                </span>
              )}
            </div>
            {editMode ? (
              <input
                type="text"
                className="form-control form-control-lg border-0 px-0 fw-bold"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter title"
                style={{ fontSize: "1.25rem" }}
              />
            ) : (
              <h5 className="fw-bold mb-0">{announcement.title}</h5>
            )}
          </div>
          <div className="d-flex gap-2">
            {canArchive && (
              <button
                className={`btn btn-sm ${
                  announcement.isArchived ? "btn-warning" : "btn-secondary"
                }`}
                onClick={handleArchiveToggle}
                disabled={isArchiving}
              >
                {isArchiving ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    <i
                      className={`fas ${
                        announcement.isArchived ? "fa-box-open" : "fa-archive"
                      } me-1`}
                    ></i>
                    {announcement.isArchived ? "Unarchive" : "Archive"}
                  </>
                )}
              </button>
            )}
            {canDelete && (
              <button
                className="btn btn-sm btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    <i className="fas fa-trash me-1"></i> Delete
                  </>
                )}
              </button>
            )}
            {canEdit && (
              <button
                className={`btn btn-sm ${
                  editMode ? "btn-success" : "btn-outline-secondary"
                }`}
                onClick={handleEdit}
              >
                {editMode ? (
                  <>
                    <i className="fas fa-save me-1"></i>
                    Save
                  </>
                ) : (
                  <>
                    <i className="fas fa-edit me-1"></i>
                    Edit
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {editMode ? (
          <div
            className="editor-container rounded border"
            style={{ maxHeight: "400px" }}
          >
            <TipTapEditor
              value={editedContent}
              onChange={setEditedContent}
              style={{
                height: "100%",
                maxHeight: "400px",
                marginBottom: "0",
              }}
            />
          </div>
        ) : (
          <div
            className="card-text mb-3 rich-text-content"
            style={{ maxHeight: "400px", overflowY: "auto" }}
            dangerouslySetInnerHTML={createSanitizedHTML(announcement.content)}
          />
        )}

        <hr className="my-3" />

        <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
          <div className="d-flex align-items-center gap-2">
            <i className="fas fa-user"></i>
            <span>{announcement.author}</span>
            <span>•</span>
            <i className="far fa-clock"></i>
            <span>{formatDate(announcement.createdAt)}</span>
          </div>
          <button
            className={`btn btn-sm btn-link text-muted text-decoration-none ${
              showComments ? "text-primary" : ""
            }`}
            onClick={() => setShowComments(!showComments)}
          >
            <i
              className={`${showComments ? "fas" : "far"} fa-comment me-1`}
            ></i>
            {announcement.comments?.length || 0} Comments
          </button>
        </div>

        {showComments && (
          <div className="comments-section mt-3 border-top pt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Comments</h6>
              <span className="badge bg-secondary">
                {announcement.comments?.length || 0} total
              </span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className={`btn ${
                    isSubmitting ? "btn-secondary" : "btn-primary"
                  }`}
                  disabled={isSubmitting || !comment.trim()}
                >
                  {isSubmitting ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {announcement.comments?.map((comment, index) => (
                <div
                  key={index}
                  className="comment p-3 mb-2 rounded"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderLeft: `3px solid ${getCardAccent(
                      comment.department
                    )}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-semibold">{comment.userName}</span>
                      <span className="text-muted">•</span>
                      <span
                        className={`badge bg-${getBadgeColor(
                          comment.department
                        )} bg-opacity-75`}
                      >
                        <i className="fas fa-building me-1"></i>
                        {comment.department}
                      </span>
                    </div>
                    <small className="text-muted">
                      {formatDate(comment.createdAt)}
                    </small>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementItem;
