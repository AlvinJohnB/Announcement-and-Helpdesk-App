import React, { useState } from "react";
import DOMPurify from "dompurify";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const HelpdeskTicketItem = ({ ticket, refreshTickets }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState(ticket.comments || []);
  const [loadingComments, setLoadingComments] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [closeError, setCloseError] = useState("");
  const [editCommentIdx, setEditCommentIdx] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState("");

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getBadgeColor = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };
  const createSanitizedHTML = (content) => {
    return {
      __html: DOMPurify.sanitize(content),
    };
  };
  const canEdit =
    user &&
    (user.role === "superadmin" ||
      ticket.requester === user._id ||
      (user.role === "admin" && user.department === ticket.department));
  // Only superadmin or admin of the concern department can delete tickets
  const canDelete =
    user &&
    (user.role === "superadmin" ||
      (user.role === "admin" && user.department === ticket.department));

  // Only superadmin, admin of department, or requester (if open) can close
  const canClose =
    user &&
    (user.role === "superadmin" ||
      (user.role === "admin" && user.department === ticket.department) ||
      (ticket.status === "open" && ticket.requester === user._id));
  const canReopen =
    user &&
    ticket.status === "closed" &&
    (user.role === "superadmin" ||
      (user.role === "admin" && user.department === ticket.department));
  // Only superadmin can delete closed tickets, others can only delete open/in-progress tickets they own

  const handleDelete = async () => {
    setForbidden(false);
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await axios.delete(`/api/endorsements/${ticket._id}`);
        refreshTickets();
      } catch (err) {
        if (err.response && err.response.status === 403) setForbidden(true);
      }
    }
  };

  const handleClose = async () => {
    setForbidden(false);
    setCloseError("");
    setShowCloseModal(true);
  };

  const submitClose = async (e) => {
    e.preventDefault();
    setIsClosing(true);
    setCloseError("");
    try {
      await axios.put(`/api/endorsements/${ticket._id}/close`, {
        reason: closeReason,
      });
      setShowCloseModal(false);
      setCloseReason("");
      refreshTickets();
    } catch (err) {
      if (err.response && err.response.status === 403) setForbidden(true);
      else setCloseError(err.response?.data?.msg || "Error closing ticket");
    } finally {
      setIsClosing(false);
    }
  };

  const handleReopen = async () => {
    setForbidden(false);
    if (window.confirm("Are you sure you want to re-open this ticket?")) {
      try {
        await axios.put(`/api/endorsements/${ticket._id}/reopen`);
        refreshTickets();
      } catch (err) {
        if (err.response && err.response.status === 403) setForbidden(true);
      }
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await axios.get(`/api/endorsements/${ticket._id}/comments`);
      setComments(res.data);
    } catch (err) {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setForbidden(false);
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`/api/endorsements/${ticket._id}/comments`, {
        content: comment,
      });
      setComments(res.data);
      setComment("");
    } catch (err) {
      if (err.response && err.response.status === 403) setForbidden(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCommentSubmit = async (e, idx) => {
    e.preventDefault();
    setForbidden(false);
    if (!editCommentValue.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.put(
        `/api/endorsements/${ticket._id}/comments/${comments[idx]._id}`,
        {
          content: editCommentValue,
        }
      );
      const updatedComments = [...comments];
      updatedComments[idx] = res.data;
      setComments(updatedComments);
      setEditCommentIdx(null);
      setEditCommentValue("");
    } catch (err) {
      if (err.response && err.response.status === 403) setForbidden(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="card mb-4 shadow"
      style={{ borderLeft: `6px solid #0d6efd` }}
    >
      <div className="card-body">
        {forbidden && (
          <div className="alert alert-danger d-flex align-items-center mb-3">
            <i className="fas fa-ban me-2"></i>
            <span>You are forbidden to perform this action.</span>
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">{ticket.subject}</h5>
          <span className={`badge bg-${getBadgeColor(ticket.priority)}`}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </span>
        </div>
        <div
          className="mb-2"
          dangerouslySetInnerHTML={createSanitizedHTML(ticket.description)}
        />
        <div className="text-muted small mb-2">
          Status:{" "}
          <span className="fw-bold">
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </span>
          {" | Department: "}
          {ticket.department} | Created: {formatDate(ticket.createdAt)}
          {ticket.edited && <span className="text-muted ms-2">(edited)</span>}
        </div>
        <div className="mb-2">
          {canDelete && (
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          {canClose && ticket.status !== "closed" && (
            <button
              className="btn btn-secondary btn-sm me-2"
              onClick={handleClose}
            >
              Close Ticket
            </button>
          )}
          {canReopen && (
            <button className="btn btn-success btn-sm" onClick={handleReopen}>
              Re-open Ticket
            </button>
          )}
        </div>
        {/* Close Ticket Modal */}
        {showCloseModal && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <form onSubmit={submitClose}>
                  <div className="modal-header">
                    <h5 className="modal-title">Close Ticket</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowCloseModal(false)}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <label className="form-label">
                      Reason for closing this ticket{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      value={closeReason}
                      onChange={(e) => setCloseReason(e.target.value)}
                      required
                      rows={3}
                      disabled={isClosing}
                    />
                    {closeError && (
                      <div className="alert alert-danger mt-2">
                        {closeError}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowCloseModal(false)}
                      disabled={isClosing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isClosing || !closeReason.trim()}
                    >
                      {isClosing ? "Closing..." : "Close Ticket"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {ticket.status === "closed" && (
          <>
            {console.log(
              "DEBUG closedBy:",
              ticket.closedBy,
              "closedByName:",
              ticket.closedByName
            )}
            <div className="alert alert-info d-flex align-items-center mt-3">
              <i className="fas fa-lock me-2"></i>
              <span>
                This ticket was closed
                {(ticket.closedByName || ticket.closedBy) &&
                  ticket.closedAt && (
                    <>
                      {" by "}
                      <b>
                        {ticket.closedByName ||
                          (typeof ticket.closedBy === "object"
                            ? ticket.closedBy.firstName &&
                              ticket.closedBy.lastName
                              ? `${ticket.closedBy.firstName} ${ticket.closedBy.lastName}`
                              : ticket.closedBy.username
                            : typeof ticket.closedBy === "string" &&
                              ticket.closedBy.length === 24
                            ? `Unknown (ID: ${ticket.closedBy})`
                            : undefined) ||
                          "an admin"}
                      </b>
                      {" on "}
                      {formatDate(ticket.closedAt)}
                    </>
                  )}
                .
                {ticket.closeReason && (
                  <>
                    <br />
                    <span className="fw-semibold">Reason:</span>{" "}
                    {ticket.closeReason}
                  </>
                )}
              </span>
            </div>
          </>
        )}
        {/* Communication Trail button and section */}
        {(ticket.status !== "closed" || showComments) && (
          <button
            className="btn btn-link btn-sm px-0"
            onClick={() => {
              setShowComments((v) => !v);
              if (!showComments) fetchComments();
            }}
            disabled={
              ticket.status !== "closed" &&
              ticket.status !== "open" &&
              ticket.status !== "in progress"
            }
          >
            {showComments
              ? "Hide Communication Trail"
              : `Show Communication Trail (${ticket.comments?.length || 0})`}
          </button>
        )}
        {/* Always show communication trail if ticket is closed, or if showComments is true */}
        {(ticket.status === "closed" || showComments) && (
          <div className="mt-3">
            <div className="fw-bold mb-2">Communication Trail</div>
            {ticket.status === "closed" && comments.length === 0 && (
              <div className="text-muted">No communication trail yet.</div>
            )}
            {comments.length > 0 &&
              comments.map((c, idx) => (
                <div key={idx} className="border rounded p-2 mb-2 bg-light">
                  <div className="fw-bold small">
                    {c.userName && c.userName.trim() !== ""
                      ? c.userName
                      : c.username || "Unknown User"}
                  </div>
                  <div className="small">
                    {editCommentIdx === idx ? (
                      // Only allow editing if ticket is not closed
                      ticket.status !== "closed" ? (
                        <form
                          className="d-flex align-items-center"
                          onSubmit={(e) => handleEditCommentSubmit(e, idx)}
                        >
                          <input
                            type="text"
                            className="form-control form-control-sm me-2"
                            value={editCommentValue}
                            onChange={(e) =>
                              setEditCommentValue(e.target.value)
                            }
                            maxLength={300}
                            required
                            autoFocus
                          />
                          <button
                            className="btn btn-success btn-sm me-1"
                            type="submit"
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            type="button"
                            onClick={() => setEditCommentIdx(null)}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>{c.content}</>
                      )
                    ) : (
                      <>
                        {c.content}
                        {c.edited && (
                          <span
                            className="text-muted ms-2"
                            style={{ fontSize: "0.85em" }}
                          >
                            (edited)
                          </span>
                        )}
                        {/* Only show Edit button if ticket is not closed and user is author */}
                        {ticket.status !== "closed" &&
                          user &&
                          (user._id === c.userId ||
                            user.username === c.username) && (
                            <button
                              className="btn btn-link btn-sm text-decoration-underline ms-2 p-0"
                              style={{ fontSize: "0.85em" }}
                              onClick={() => {
                                setEditCommentIdx(idx);
                                setEditCommentValue(c.content);
                              }}
                            >
                              Edit
                            </button>
                          )}
                        {/* Show edit history to admins/superadmin */}
                        {c.editHistory &&
                          c.editHistory.length > 0 &&
                          (user?.role === "admin" ||
                            user?.role === "superadmin") && (
                            <details className="mt-1">
                              <summary className="small text-muted">
                                View edit history
                              </summary>
                              <ul className="list-unstyled mb-0">
                                {c.editHistory.map((h, hIdx) => (
                                  <li
                                    key={hIdx}
                                    className="border rounded p-2 mb-1 bg-light-subtle"
                                  >
                                    <div className="small">{h.content}</div>
                                    <div className="text-muted small">
                                      Edited: {formatDate(h.editedAt)}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          )}
                      </>
                    )}
                  </div>
                  <div className="text-muted small">
                    {formatDate(c.createdAt)}
                  </div>
                </div>
              ))}
            {/* Only allow adding to communication trail if not closed */}
            {ticket.status !== "closed" && user && (
              <form className="mt-2" onSubmit={handleCommentSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add to communication trail..."
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
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpdeskTicketItem;
