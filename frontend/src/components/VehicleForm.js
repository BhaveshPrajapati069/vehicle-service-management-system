import React, { useState, useEffect } from "react";
import API from "../api";

function VehicleForm() {
  const [vin, setVin] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [model, setModel] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 5000); // Auto-refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await API.get("vehicles/");
      setVehicles(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vin || !ownerName || !model) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await API.post("vehicles/", {
        vin,
        owner_name: ownerName,
        model,
      });
      setVin("");
      setOwnerName("");
      setModel("");
      fetchVehicles(); // Refresh after adding
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">🚗 Add Vehicle</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="form-group mb-3">
          <label>VIN</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. GJ01-1234"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Owner Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Raj"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>

        <div className="form-group mb-4">
          <label>Model</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Activa 6G"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>

      <h4 className="mt-5 mb-3">🚘 All Vehicles</h4>
      {lastUpdated && (
        <p className="text-muted">Last updated at {lastUpdated}</p>
      )}

      <div className="row">
        {vehicles.map((v) => (
          <div key={v.id} className="col-md-4 col-sm-6 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-capitalize">{v.model}</h5>
                <p className="card-text">🔑 VIN: {v.vin}</p>
                <p className="card-text">👤 Owner: {v.owner_name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleForm;
