import React, { useState } from "react";
import EndorsementList from "./EndorsementList";
import EndorsementForm from "./EndorsementForm";

const EndorsementTabs = () => {
  const [activeTab, setActiveTab] = useState("view");

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "view" ? "active" : ""}`}
            onClick={() => handleTabChange("view")}
          >
            <i className="fas fa-list me-2"></i>
            View Endorsements
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "add" ? "active" : ""}`}
            onClick={() => handleTabChange("add")}
          >
            <i className="fas fa-plus me-2"></i>
            Create Endorsement
          </button>
        </li>
      </ul>
      {activeTab === "view" && <EndorsementList />}
      {activeTab === "add" && <EndorsementForm />}
    </>
  );
};

export default EndorsementTabs;
