import React, { useState, useEffect } from "react";
import AnnouncementItem from "./AnnouncementItem";
import { useAuth } from "../context/AuthContext";

const AnnouncementList = ({
  announcements: initialAnnouncements,
  onUpdate,
  showArchived,
}) => {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState("all");
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  useEffect(() => {
    setAnnouncements(initialAnnouncements);
  }, [initialAnnouncements]);

  const departments = [
    "Laboratory",
    "Imaging",
    "Reception",
    "Phlebotomy",
    "HK/Messenger",
    "Others",
  ];

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

  const filteredAnnouncements =
    filter === "all"
      ? announcements
      : announcements.filter((a) => a.department === filter);
  return (
    <div>
      {" "}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">
          {showArchived ? "Archived Announcements" : "Recent Announcements"}
        </h2>
        {isAuthenticated && (
          <div className="d-flex gap-2">
            <button
              key="all"
              className={`btn ${
                filter === "all" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setFilter("all")}
            >
              All Departments
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                className={`btn ${
                  filter === dept
                    ? `btn-${getBadgeColor(dept)}`
                    : `btn-outline-${getBadgeColor(dept)}`
                }`}
                onClick={() => setFilter(dept)}
              >
                <i className="fas fa-building me-1"></i>
                {dept}
              </button>
            ))}
          </div>
        )}
      </div>
      {filteredAnnouncements.length === 0 ? (
        <div className="alert alert-light text-center p-5">
          <i className="fas fa-info-circle fs-3 mb-3 d-block"></i>{" "}
          <p className="mb-0">
            {showArchived ? (
              <>
                No archived announcements found for{" "}
                {filter === "all" ? "any department" : filter}
              </>
            ) : (
              <>
                No announcements found for{" "}
                {filter === "all" ? "any department" : filter}
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="announcement-list">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementItem
              key={announcement._id}
              announcement={announcement}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;
