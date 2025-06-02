import "./App.css";
import "./assets/styles/Announcement.css";
import React, { useState, useEffect } from "react";
import api from "./utils/api";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/common/Header";
import AnnouncementList from "./components/announcements/AnnouncementList";
import AnnouncementForm from "./components/announcements/AnnouncementForm";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Login from "./components/auth/Login";
import UserManagement from "./components/auth/UserManagement";
import HelpdeskTabs from "./components/helpdesk/HelpdeskTabs";
import QCTestCard from "./components/QCTestCard";
import QCTestList from "./components/QCTestList";
import QCHomeTab from "./components/QCHomeTab";

function AppContent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parentTab, setParentTab] = useState("announcement"); // 'announcement', 'helpdesk', 'users'
  const [announcementTab, setAnnouncementTab] = useState("view"); // 'view', 'archive', 'add'
  const [showArchived, setShowArchived] = useState(false);

  const fetchAnnouncements = async (archived = false) => {
    try {
      setLoading(true);

      const res = await api.get(`/api/announcements?archived=${archived}`);

      setAnnouncements(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Could not load announcements. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(showArchived);
  }, [showArchived]);

  const handleParentTabChange = (tab) => {
    setParentTab(tab);
    // Reset child tab if switching to announcement or qcannouncements
    if (tab === "announcement") setAnnouncementTab("view");
    else if (tab === "qcannouncements") setAnnouncementTab("qc-home");
  };
  const handleAnnouncementTabChange = (tab) => {
    setAnnouncementTab(tab);
    if (tab === "archive") setShowArchived(true);
    else setShowArchived(false);
  };

  return (
    <div className="App">
      <Header userInfo={user} onLogout={logout} />
      <div className="container py-4">
        {!isAuthenticated ? (
          <>
            <div className="alert alert-info mb-4">
              <i className="fas fa-info-circle me-2"></i>
              Please log in to create announcements or add comments.
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <AnnouncementList announcements={announcements} />
            )}
            <div className="text-center mt-4 p-4 bg-light rounded">
              <h4 className="mb-3">Log in to contribute</h4>
              <Login onLogin={login} />
            </div>
          </>
        ) : (
          <>
            {/* Parent Tabs */}
            <ul className="nav nav-pills mb-4 flex-wrap gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    parentTab === "announcement" ? "active" : ""
                  }`}
                  onClick={() => handleParentTabChange("announcement")}
                >
                  <i className="fas fa-bullhorn me-2"></i>
                  Announcements
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    parentTab === "helpdesk" ? "active" : ""
                  }`}
                  onClick={() => handleParentTabChange("helpdesk")}
                >
                  <i className="fas fa-ticket-alt me-2"></i>
                  Helpdesk
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    parentTab === "qcannouncements" ? "active" : ""
                  }`}
                  onClick={() => handleParentTabChange("qcannouncements")}
                >
                  <i className="fas fa-vials me-2"></i>
                  QC Announcements
                </button>
              </li>
              {(user?.role === "superadmin" || user?.role === "admin") && (
                <li className="nav-item ms-auto">
                  <button
                    className={`nav-link ${
                      parentTab === "users" ? "active" : ""
                    }`}
                    onClick={() => handleParentTabChange("users")}
                  >
                    <i className="fas fa-users me-2"></i>
                    User Management
                  </button>
                </li>
              )}
            </ul>

            {/* Child Tabs for Announcement */}
            {parentTab === "announcement" && (
              <>
                <ul className="nav nav-tabs mb-4 flex-wrap gap-2">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        announcementTab === "view" ? "active" : ""
                      }`}
                      onClick={() => handleAnnouncementTabChange("view")}
                    >
                      <i className="fas fa-list me-2"></i>
                      View Announcements
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        announcementTab === "archive" ? "active" : ""
                      }`}
                      onClick={() => handleAnnouncementTabChange("archive")}
                    >
                      <i className="fas fa-archive me-2"></i>
                      Archived
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        announcementTab === "add" ? "active" : ""
                      }`}
                      onClick={() => handleAnnouncementTabChange("add")}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Create Announcement
                    </button>
                  </li>
                </ul>
                {loading &&
                (announcementTab === "view" ||
                  announcementTab === "archive") ? (
                  <LoadingSpinner />
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <>
                    {(announcementTab === "view" ||
                      announcementTab === "archive") && (
                      <AnnouncementList
                        announcements={announcements}
                        onUpdate={() =>
                          fetchAnnouncements(announcementTab === "archive")
                        }
                        showArchived={announcementTab === "archive"}
                      />
                    )}
                    {announcementTab === "add" && (
                      <AnnouncementForm
                        refreshAnnouncements={fetchAnnouncements}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {/* Helpdesk Tab */}
            {parentTab === "helpdesk" && <HelpdeskTabs />}

            {/* QC Announcements Tab */}
            {parentTab === "qcannouncements" && (
              <>
                {/* Child Tabs for QC Announcements */}
                <ul className="nav nav-tabs mb-4 flex-wrap gap-2">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        announcementTab === "qc-home" ? "active" : ""
                      }`}
                      onClick={() => setAnnouncementTab("qc-home")}
                    >
                      <i className="fas fa-home me-2"></i>
                      Home
                    </button>
                  </li>
                  {((user?.department &&
                    user.department.toLowerCase().includes("lab")) ||
                    user?.role === "superadmin") && (
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          announcementTab === "qc-list" ? "active" : ""
                        }`}
                        onClick={() => setAnnouncementTab("qc-list")}
                      >
                        <i className="fas fa-list me-2"></i>
                        Test List
                      </button>
                    </li>
                  )}
                </ul>
                {announcementTab === "qc-home" && <QCHomeTab />}
                {announcementTab === "qc-list" &&
                  ((user?.department &&
                    user.department.toLowerCase().includes("lab")) ||
                    user?.role === "superadmin") && <QCTestList />}
              </>
            )}

            {/* User Management Tab */}
            {parentTab === "users" &&
              (user?.role === "superadmin" || user?.role === "admin") && (
                <UserManagement />
              )}
          </>
        )}
      </div>
      <footer className="bg-light text-center py-3 mt-auto border-top small text-muted">
        <div>
          &copy; {new Date().getFullYear()} Announcements and Helpdesk &mdash;
          Developed by AlvinJohnB
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
