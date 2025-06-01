import "./App.css";
import "./components/Announcement.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import AnnouncementList from "./components/AnnouncementList";
import AnnouncementForm from "./components/AnnouncementForm";
import LoadingSpinner from "./components/LoadingSpinner";
import Login from "./components/auth/Login";
import UserManagement from "./components/auth/UserManagement";
import HelpdeskTabs from "./components/HelpdeskTabs";

function AppContent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("view"); // 'view' or 'archive' or 'add' or 'users'
  const [showArchived, setShowArchived] = useState(false);

  const fetchAnnouncements = async (archived = false) => {
    try {
      setLoading(true);
      console.log("Fetching announcements, archived:", archived);
      const res = await axios.get(`/api/announcements?archived=${archived}`);
      console.log("Received announcements:", res.data);
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

  const handleTabChange = (tab) => {
    if (tab === "view" || tab === "archive") {
      setShowArchived(tab === "archive");
    }
    setActiveTab(tab);
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
            <ul className="nav nav-pills mb-4 flex-wrap gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "view" ? "active" : ""}`}
                  onClick={() => handleTabChange("view")}
                >
                  <i className="fas fa-list me-2"></i>
                  View Announcements
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "archive" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("archive")}
                >
                  <i className="fas fa-archive me-2"></i>
                  Archived
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "add" ? "active" : ""}`}
                  onClick={() => handleTabChange("add")}
                >
                  <i className="fas fa-plus me-2"></i>
                  Create Announcement
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "helpdesk" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("helpdesk")}
                >
                  <i className="fas fa-ticket-alt me-2"></i>
                  Helpdesk
                </button>
              </li>
              {(user?.role === "superadmin" || user?.role === "admin") && (
                <li className="nav-item ms-auto">
                  <button
                    className={`nav-link ${
                      activeTab === "users" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("users")}
                  >
                    <i className="fas fa-users me-2"></i>
                    User Management
                  </button>
                </li>
              )}
            </ul>

            {loading && (activeTab === "view" || activeTab === "archive") ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
                {(activeTab === "view" || activeTab === "archive") && (
                  <AnnouncementList
                    announcements={announcements}
                    onUpdate={() => fetchAnnouncements(activeTab === "archive")}
                    showArchived={activeTab === "archive"}
                  />
                )}
                {activeTab === "add" && (
                  <AnnouncementForm refreshAnnouncements={fetchAnnouncements} />
                )}
                {activeTab === "helpdesk" && <HelpdeskTabs />}
                {activeTab === "users" &&
                  (user?.role === "superadmin" || user?.role === "admin") && (
                    <UserManagement />
                  )}
              </>
            )}
          </>
        )}
      </div>
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
