import React, { useState, useEffect } from "react";
import api from "../utils/api";

const statusOptions = [
  "Ongoing",
  "QC Passed",
  "QC Troubleshooting",
  "For Send-out",
  "Remaining Test"
];

const sectionOptions = [
  "Chemistry",
  "Clinical Microscopy",
  "Serology",
  "Hematology",
  "Drug Testing"
];

const QCTestList = () => {
  const [tests, setTests] = useState([]);
  const [testName, setTestName] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);
  const [section, setSection] = useState(sectionOptions[0]);
  const [remaining, setRemaining] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    api.get("/api/qctests")
      .then(res => setTests(res.data))
      .catch(() => setTests([]));
  }, []);

  // For suggestions
  const testNameSuggestions = Array.from(new Set(tests.map(t => t.name)));

  const handleTestNameChange = (e) => {
    const value = e.target.value;
    setTestName(value);
    // If the name matches an existing test, populate form for editing
    const match = tests.find(t => t.name.trim().toLowerCase() === value.trim().toLowerCase());
    if (match) {
      setStatus(match.status);
      setSection(match.section);
      setRemaining(match.status === "Remaining Test" ? match.remaining : "");
      setRemarks(match.remarks || "");
      setIsEditing(true);
    } else {
      setStatus(statusOptions[0]);
      setSection(sectionOptions[0]);
      setRemaining("");
      setRemarks("");
      setIsEditing(false);
    }
  };

  const handleSuggestionClick = (name) => {
    setTestName(name);
    const match = tests.find(t => t.name === name);
    if (match) {
      setStatus(match.status);
      setSection(match.section);
      setRemaining(match.status === "Remaining Test" ? match.remaining : "");
      setRemarks(match.remarks || "");
      setIsEditing(true);
    }
  };

  const addTest = async () => {
    if (!testName) return;
    // Check if a test with the same name exists
    const existing = tests.find(
      t => t.name.trim().toLowerCase() === testName.trim().toLowerCase()
    );
    const newTest = {
      name: testName,
      status,
      section,
      remarks,
      remaining: status === "Remaining Test" ? Number(remaining) : null
    };
    try {
      if (existing) {
        // Update existing test
        const res = await api.post(`/api/qctests`, { ...newTest, _id: existing._id });
        setTests([
          res.data,
          ...tests.filter(t => t._id !== existing._id)
        ]);
      } else {
        // Create new test
        const res = await api.post("/api/qctests", newTest);
        setTests([res.data, ...tests]);
      }
      setTestName("");
      setStatus(statusOptions[0]);
      setSection(sectionOptions[0]);
      setRemaining("");
      setRemarks("");
      setIsEditing(false);
    } catch {
      // handle error (optional)
    }
  };

  const deleteTest = async (id) => {
    try {
      await api.delete(`/api/qctests/${id}`);
      setTests(tests.filter(t => t._id !== id));
    } catch {
      // handle error (optional)
    }
  };

  // Group tests by section for display
  const groupedTests = sectionOptions.reduce((acc, section) => {
    acc[section] = tests.filter(t => t.section === section);
    return acc;
  }, {});

  const setStatusToPassed = async (test) => {
    const updated = { ...test, status: "QC Passed" };
    try {
      const res = await api.post("/api/qctests", { ...updated, _id: test._id });
      setTests([
        res.data,
        ...tests.filter(t => t._id !== test._id)
      ]);
    } catch {
      // handle error (optional)
    }
  };

  const resetAllStatus = async () => {
    try {
      const updatedTests = await Promise.all(
        tests.map(async (test) => {
          if (test.status !== "Ongoing" || test.remarks) {
            const updated = { ...test, status: "Ongoing", remarks: "" };
            const res = await api.post("/api/qctests", { ...updated, _id: test._id });
            return res.data;
          }
          return test;
        })
      );
      setTests(updatedTests);
    } catch {
      // handle error (optional)
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">QC Test List</h5>
        <div className="mb-3 text-end">
          <button className="btn btn-outline-secondary btn-sm" onClick={resetAllStatus}>
            Reset All Status
          </button>
        </div>
        <div className="row g-2 align-items-end mb-3">
          <div className="col-md-4 position-relative">
            <label className="form-label">Test Name</label>
            <input
              type="text"
              className="form-control"
              value={testName}
              onChange={handleTestNameChange}
              placeholder="Enter test name"
              list="test-name-suggestions"
              autoComplete="off"
            />
            <datalist id="test-name-suggestions">
              {testNameSuggestions.map((name, idx) => (
                <option value={name} key={idx} />
              ))}
            </datalist>
          </div>
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Section</label>
            <select
              className="form-select"
              value={section}
              onChange={e => setSection(e.target.value)}
            >
              {sectionOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {status === "Remaining Test" && (
            <div className="col-md-3">
              <label className="form-label">Remaining</label>
              <input
                type="number"
                className="form-control"
                value={remaining}
                onChange={e => setRemaining(e.target.value)}
                min="0"
              />
            </div>
          )}
          <div className="col-md-12">
            <label className="form-label">Remarks</label>
            <input
              type="text"
              className="form-control"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Enter remarks (optional)"
            />
          </div>
          <div className="col-md-1">
            <button className="btn btn-primary w-100" onClick={addTest}>
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </div>
        <hr />
        <div>
          {sectionOptions.map(section => (
            groupedTests[section].length > 0 && (
              <div key={section} className="mb-4">
                <h6 className="fw-bold mb-2">{section}</h6>
                <ul className="list-group">
                  {groupedTests[section].map((test, idx) => (
                    <li key={test._id || idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <strong>{test.name}</strong> - {test.status}
                        {test.section && (
                          <span className="badge bg-secondary ms-2">{test.section}</span>
                        )}
                        {test.status === "Remaining Test" && `: ${test.remaining}`}
                        {test.remarks && (
                          <span className="ms-2 text-muted small">({test.remarks})</span>
                        )}
                      </span>
                      <div className="d-flex gap-2 align-items-center">
                        {test.status !== "QC Passed" && (
                          <button
                            className="btn btn-sm btn-success"
                            title="Set status to QC Passed"
                            onClick={() => setStatusToPassed(test)}
                          >
                            Change status to QC Passed
                          </button>
                        )}
                        <button className="btn btn-sm btn-danger" onClick={() => deleteTest(test._id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
          {tests.length === 0 && <div className="text-muted">No tests added yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default QCTestList;
