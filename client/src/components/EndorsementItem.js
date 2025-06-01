import React, { useState } from "react";
import DOMPurify from "dompurify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const EndorsementItem = ({ endorsement, refreshEndorsements }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState(endorsement.comments || []);
  const [loadingComments, setLoadingComments] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getBadgeColor = (department) => {
    switch (department) {
      case "Laboratory":
        return "primary";
      case "Imaging":
        return "info";
      case "Reception":
        return "success";
      case "Phlebotomy":
        return "danger";
      case "HK/Messenger":
        return "warning";
      case "Others":
        return "secondary";
      default:
        return "secondary";
    }
  };
  const getCardAccent = (department) => {
    const colors = {
      Laboratory: "#0d6efd",
      Imaging: "#0dcaf0",
      Reception: "#198754",
      Phlebotomy: "#dc3545",
      "HK/Messenger": "#ffc107",
      Others: "#6c757d",
    };
    return colors[department] || colors.Others;
  };
  const createSanitizedHTML = (content) => {
    return {
      __html: DOMPurify.sanitize(content),
    };
  };
  const canEdit =
    user &&
    (user.role === "superadmin" ||
      endorsement.authorId === user._id ||
      (user.department === endorsement.department && user.role === "admin"));

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this endorsement?")) {
      await axios.delete(`/api/endorsements/${endorsement._id}`);
      refreshEndorsements();
    }
  };

  const handleArchive = async () => {
    await axios.put(`/api/endorsements/${endorsement._id}/archive`);
    refreshEndorsements();
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await axios.get(
        `/api/endorsements/${endorsement._id}/comments`
      );
      setComments(res.data);
    } catch (err) {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `/api/endorsements/${endorsement._id}/comments`,
        { content: comment }
      );
      setComments(res.data);
      setComment("");
    } catch (err) {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="card mb-4 shadow"
      style={{
        borderLeft: `6px solid ${getCardAccent(endorsement.department)}`,
      }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">{endorsement.title}</h5>
          <span className={`badge bg-${getBadgeColor(endorsement.department)}`}>
            {endorsement.department}
          </span>
        </div>
        <div
          className="mb-2"
          dangerouslySetInnerHTML={createSanitizedHTML(endorsement.content)}
        />
        <div className="text-muted small mb-2">
          Posted: {formatDate(endorsement.createdAt)}
        </div>
        {canEdit && (
          <div className="mb-2">
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleArchive}
            >
              Archive
            </button>
          </div>
        )}
        <button
          className="btn btn-link btn-sm px-0"
          onClick={() => {
            setShowComments((v) => !v);
            if (!showComments) fetchComments();
          }}
        >
          {showComments
            ? "Hide Comments"
            : `Show Comments (${endorsement.comments?.length || 0})`}
        </button>
        {showComments && (
          <div className="mt-3">
            {loadingComments ? (
              <div>Loading comments...</div>
            ) : (
              <>
                {comments.length === 0 && (
                  <div className="text-muted">No comments yet.</div>
                )}
                {comments.map((c, idx) => (
                  <div key={idx} className="border rounded p-2 mb-2 bg-light">
                    <div className="fw-bold small">
                      {c.userName}{" "}
                      <span className="text-muted">({c.department})</span>
                    </div>
                    <div className="small">{c.content}</div>
                    <div className="text-muted small">
                      {formatDate(c.createdAt)}
                    </div>
                  </div>
                ))}
                {user && (
                  <form className="mt-2" onSubmit={handleCommentSubmit}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={isSubmitting}
                        maxLength={300}
                        required
                      />
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={isSubmitting || !comment.trim()}
                      >
                        {isSubmitting ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EndorsementItem;
