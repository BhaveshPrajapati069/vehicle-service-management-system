import React, { useState, useEffect } from "react";
import API from "../api";

function IssueForm() {
  const [vehicleId, setVehicleId] = useState("");
  const [description, setDescription] = useState("");
  const [issues, setIssues] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch vehicles for dropdown
  const fetchVehicles = async () => {
    try {
      const res = await API.get("vehicles/");
      setVehicles(res.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // Fetch issues list
  const fetchIssues = async () => {
    try {
      const res = await API.get("issues/");
      setIssues(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchIssues();
    const interval = setInterval(fetchIssues, 5000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleId || !description) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await API.post("issues/", { vehicle: vehicleId, description });
      setVehicleId("");
      setDescription("");
      fetchIssues(); // Refresh after submit
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">⚠️ Report Vehicle Issue</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
        <div className="form-group mb-3">
          <label>Select Vehicle</label>
          <select
            className="form-control"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.model} — {v.vin}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-4">
          <label>Issue Description</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Brake not working"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>

      <h4 className="mb-3">🛠️ All Reported Issues</h4>
      {lastUpdated && (
        <p className="text-muted">Last updated at {lastUpdated}</p>
      )}

      <div className="row">
        {issues.map((issue) => (
          <div key={issue.id} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-danger">❗ {issue.description}</h5>
                <p className="card-text">
  🚗 Vehicle Name:{" "}
  {
    vehicles.find((v) => v.id === issue.vehicle)
      ? `${vehicles.find((v) => v.id === issue.vehicle).model} (${vehicles.find((v) => v.id === issue.vehicle).vin})`
      : "Unknown Vehicle"
  }
</p>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IssueForm;
