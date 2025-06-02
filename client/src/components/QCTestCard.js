import React, { useState } from "react";

const statusOptions = [
  "Ongoing",
  "QC Passed",
  "QC Troubleshooting",
  "For Send-out",
  "Remaining Test",
];

const QCTestCard = () => {
  const [testName, setTestName] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);
  const [remaining, setRemaining] = useState("");

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">QC Test Status</h5>
        <div className="mb-3">
          <label className="form-label">Test Name</label>
          <input
            type="text"
            className="form-control"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Enter test name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "Remaining Test"
                  ? `Remaining Test: ${remaining || 0}`
                  : opt}
              </option>
            ))}
          </select>
        </div>
        {status === "Remaining Test" && (
          <div className="mb-3">
            <label className="form-label">Number of Remaining Tests</label>
            <input
              type="number"
              className="form-control"
              value={remaining}
              onChange={(e) => setRemaining(e.target.value)}
              min="0"
            />
          </div>
        )}
        <div className="mt-3">
          <strong>Current:</strong> {testName ? testName : "-"} <br />
          <strong>Status:</strong>{" "}
          {status === "Remaining Test"
            ? `Remaining Test: ${remaining || 0}`
            : status}
        </div>
      </div>
    </div>
  );
};

export default QCTestCard;
