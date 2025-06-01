import React, { useState } from "react";
import HelpdeskTicketList from "./HelpdeskTicketList";
import HelpdeskTicketForm from "./HelpdeskTicketForm";
import { useAuth } from "../context/AuthContext";

const departments = [
  "All",
  "Laboratory",
  "Imaging",
  "Reception",
  "Phlebotomy",
  "HK/Messenger",
  "Others",
];

const HelpdeskTabs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("view");
  const [selectedDept, setSelectedDept] = useState(user?.department || "All");

  const handleDeptChange = (e) => setSelectedDept(e.target.value);

  return (
    <div className="mb-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
        <ul className="nav nav-pills gap-2 flex-wrap">
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center ${
                activeTab === "view" ? "active" : ""
              }`}
              onClick={() => setActiveTab("view")}
              aria-label="Open Tickets"
            >
              <i className="fas fa-ticket-alt me-2"></i>
              Open Tickets
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center ${
                activeTab === "closed" ? "active" : ""
              }`}
              onClick={() => setActiveTab("closed")}
              aria-label="Closed Tickets"
            >
              <i className="fas fa-folder-minus me-2"></i>
              Closed Tickets
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center ${
                activeTab === "add" ? "active" : ""
              }`}
              onClick={() => setActiveTab("add")}
              aria-label="Submit Ticket"
            >
              <i className="fas fa-plus me-2"></i>
              Submit Ticket
            </button>
          </li>
        </ul>
        <div
          className="card p-2 border-0 shadow-sm bg-light"
          style={{ minWidth: 220, maxWidth: 300 }}
        >
          <label
            htmlFor="dept-filter"
            className="form-label mb-1 fw-semibold text-secondary"
            style={{ fontSize: "0.95rem" }}
          >
            <i className="fas fa-filter me-1"></i> Filter by Department
          </label>
          <select
            id="dept-filter"
            className="form-select form-select-sm"
            value={selectedDept}
            onChange={handleDeptChange}
            aria-label="Filter tickets by department"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        {activeTab === "view" && (
          <>
            <h5 className="mb-3 fw-bold text-primary d-flex align-items-center">
              <i className="fas fa-ticket-alt me-2"></i> Open Helpdesk Tickets
            </h5>
            <HelpdeskTicketList status="open" department={selectedDept} />
          </>
        )}
        {activeTab === "closed" && (
          <>
            <h5 className="mb-3 fw-bold text-secondary d-flex align-items-center">
              <i className="fas fa-folder-minus me-2"></i> Closed Helpdesk
              Tickets
            </h5>
            <HelpdeskTicketList status="closed" department={selectedDept} />
          </>
        )}
        {activeTab === "add" && (
          <>
            <h5 className="mb-3 fw-bold text-success d-flex align-items-center">
              <i className="fas fa-plus me-2"></i> Submit a New Ticket
            </h5>
            <HelpdeskTicketForm />
          </>
        )}
      </div>
    </div>
  );
};

export default HelpdeskTabs;
