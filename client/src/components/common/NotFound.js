import React from "react";

const NotFound = () => {
  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-lg p-5">
            <h1 className="display-1 fw-bold text-dark">404</h1>
            <div className="mb-4">
              <i className="fas fa-exclamation-circle fa-4x text-danger"></i>
            </div>
            <h2 className="fw-light mb-4">Oops! Page Not Found</h2>
            <p className="lead text-muted mb-5">
              We couldn't find the page you're looking for. It might have been
              removed, renamed, or doesn't exist.
            </p>
            <button
              className="btn btn-dark btn-lg px-4"
              onClick={() => window.history.back()}
            >
              <i className="fas fa-arrow-left me-2"></i> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
