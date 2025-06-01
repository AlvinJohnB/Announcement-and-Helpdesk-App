import React from "react";

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="loading-spinner text-center py-5">
      <div
        className="spinner-grow text-dark mb-3"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
