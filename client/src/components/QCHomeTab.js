import React, { useEffect, useState } from "react";
import api from "../utils/api";

const statusColors = {
  "QC Passed": "success", // Green
  "QC Troubleshooting": "warning", // Yellow
  "For Send-out": "danger", // Red
  "Remaining Test": "orange", // Orange (custom)
  "Ongoing": "warning" // Yellow for Ongoing
};

const sectionOrder = [
  "Chemistry",
  "Clinical Microscopy",
  "Serology",
  "Hematology",
  "Drug Testing"
];

const QCHomeTab = () => {
  const [tests, setTests] = useState([]);
  useEffect(() => {
    api.get("/api/qctests").then(res => setTests(res.data)).catch(() => setTests([]));
  }, []);

  // Get current date in readable format
  const today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Group tests by section
  const grouped = tests.reduce((acc, test) => {
    const section = test.section || "Other";
    if (!acc[section]) acc[section] = [];
    acc[section].push(test);
    return acc;
  }, {});

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4" style={{background: '#e9fbe6', border: '2px solid #198754', borderRadius: 8, padding: '1rem 1.5rem'}}>
        <h2 className="fw-bold mb-0">QC Announcements</h2>
        <span className="fs-4 fw-semibold text-dark" style={{letterSpacing: 1}}>{today}</span>
      </div>
      {sectionOrder.map(section => (
        grouped[section] && grouped[section].length > 0 && (
          <div key={section} className="mb-4">
            <h4 className="fw-bold mb-3">{section}</h4>
            <div className="row g-3">
              {grouped[section].map(test => (
                <div className="col-md-4" key={test._id}>
                  <div
                    className={`card shadow-sm h-100 border-0`}
                    style={{
                      borderLeft: `8px solid ${
                        test.status === "QC Passed" ? "#198754" :
                        test.status === "QC Troubleshooting" ? "#ffc107" :
                        test.status === "For Send-out" ? "#dc3545" :
                        test.status === "Remaining Test" ? "#fd7e14" :
                        test.status === "Ongoing" ? "#ffc107" :
                        "#0d6efd" // fallback
                      }`
                    }}
                  >
                    <div
                      className="card-header text-white"
                      style={{
                        backgroundColor:
                          test.status === "QC Passed" ? "#198754" :
                          test.status === "QC Troubleshooting" ? "#ffc107" :
                          test.status === "For Send-out" ? "#dc3545" :
                          test.status === "Remaining Test" ? "#fd7e14" :
                          test.status === "Ongoing" ? "#ffc107" :
                          "#0d6efd"
                      }}
                    >
                      {test.status === "Remaining Test"
                        ? `Remaining Test: ${test.remaining}`
                        : test.status}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{test.name}</h5>
                      {test.status === "Remaining Test" && (
                        <p className="mb-0">Remaining: <strong>{test.remaining}</strong></p>
                      )}
                      {test.remarks && (
                        <p className="mb-0 text-muted"><em>Remarks: {test.remarks}</em></p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      {/* Show sections with no tests */}
      {Object.keys(grouped).filter(
        s => !sectionOrder.includes(s)
      ).map(section => (
        <div key={section} className="mb-4">
          <h4 className="fw-bold mb-3">{section}</h4>
          <div className="row g-3">
            {grouped[section].map(test => (
              <div className="col-md-4" key={test._id}>
                <div
                  className={`card shadow-sm h-100 border-0`}
                  style={{
                    borderLeft: `8px solid ${
                      test.status === "QC Passed" ? "#198754" :
                      test.status === "QC Troubleshooting" ? "#ffc107" :
                      test.status === "For Send-out" ? "#dc3545" :
                      test.status === "Remaining Test" ? "#fd7e14" :
                      test.status === "Ongoing" ? "#ffc107" :
                      "#0d6efd"
                    }`
                  }}
                >
                  <div
                    className="card-header text-white"
                    style={{
                      backgroundColor:
                        test.status === "QC Passed" ? "#198754" :
                        test.status === "QC Troubleshooting" ? "#ffc107" :
                        test.status === "For Send-out" ? "#dc3545" :
                        test.status === "Remaining Test" ? "#fd7e14" :
                        test.status === "Ongoing" ? "#ffc107" :
                        "#0d6efd"
                    }}
                  >
                    {test.status === "Remaining Test"
                      ? `Remaining Test: ${test.remaining}`
                      : test.status}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{test.name}</h5>
                    {test.status === "Remaining Test" && (
                      <p className="mb-0">Remaining: <strong>{test.remaining}</strong></p>
                    )}
                    {test.remarks && (
                      <p className="mb-0 text-muted"><em>Remarks: {test.remarks}</em></p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {tests.length === 0 && <div className="text-muted">No QC tests found.</div>}
    </div>
  );
};

export default QCHomeTab;
