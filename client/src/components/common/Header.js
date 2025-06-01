import React, { useState } from "react";

const Header = ({ userInfo, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient bg-dark text-white py-3 shadow-sm sticky-top">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="h3 fw-bold mb-1 d-flex align-items-center">
              <i className="fas fa-bullhorn me-2"></i>
              Announcements and Helpdesk
            </h1>
            {!userInfo && (
              <p className="text-light opacity-75 small mb-0 d-none d-sm-block">
                Stay up to date with the latest announcements
              </p>
            )}
          </div>
          {userInfo && (
            <div className="d-flex align-items-center">
              <div className="me-3 text-end d-none d-md-block">
                <div className="fw-semibold">{`${userInfo?.firstName} ${userInfo?.lastName}`}</div>
                <div className="small text-light opacity-75 d-flex gap-2 align-items-center justify-content-end">
                  <span
                    className={`badge bg-${getBadgeColor(
                      userInfo?.department
                    )} bg-opacity-75`}
                  >
                    <i className="fas fa-building me-1"></i>
                    {userInfo?.department}
                  </span>
                  <span
                    className={`badge ${
                      userInfo?.role === "admin" ? "bg-danger" : "bg-primary"
                    } bg-opacity-75`}
                  >
                    <i
                      className={`fas ${
                        userInfo?.role === "admin" ? "fa-shield-alt" : "fa-user"
                      } me-1`}
                    ></i>
                    {userInfo?.role}
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-link text-light d-md-none p-0 px-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <i className="fas fa-user fs-5"></i>
                </button>
                <button
                  className="btn btn-outline-light btn-sm d-flex align-items-center"
                  onClick={onLogout}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && userInfo && (
          <div className="mt-3 p-3 bg-dark rounded border border-secondary d-md-none">
            <div className="text-center mb-2">
              <div className="fw-semibold">{`${userInfo?.firstName} ${userInfo?.lastName}`}</div>
              <div className="small text-light opacity-75 d-flex gap-2 align-items-center justify-content-center mt-2">
                <span
                  className={`badge bg-${getBadgeColor(
                    userInfo?.department
                  )} bg-opacity-75`}
                >
                  <i className="fas fa-building me-1"></i>
                  {userInfo?.department}
                </span>
                <span
                  className={`badge ${
                    userInfo?.role === "admin" ? "bg-danger" : "bg-primary"
                  } bg-opacity-75`}
                >
                  <i
                    className={`fas ${
                      userInfo?.role === "admin" ? "fa-shield-alt" : "fa-user"
                    } me-1`}
                  ></i>
                  {userInfo?.role}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
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

export default Header;
