import React, { useState, useEffect } from "react";
import API from "../api";

function ComponentForm() {
  const [components, setComponents] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [repairable, setRepairable] = useState(true);

  useEffect(() => {
    fetchComponents();

    // 🕒 Auto-refresh every 5 seconds
    const interval = setInterval(fetchComponents, 5000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  const fetchComponents = async () => {
    try {
      const res = await API.get("components/");
      setComponents(res.data);
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await API.post("components/", { name, price, repairable });
      setName("");
      setPrice("");
      setRepairable(true);
      fetchComponents(); // Refresh after submit
    } catch (error) {
      console.error("Error adding component:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">🛠️ Add Component</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Side Mirror"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Price (Rs)</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 450"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-group mb-4">
          <label>Repairable</label>
          <select
            className="form-select"
            value={repairable}
            onChange={(e) => setRepairable(e.target.value === "true")}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>

      <h4 className="mt-5 mb-3">🧾 All Components</h4>

      <div className="row">
        {components.map((comp) => (
          <div key={comp.id} className="col-md-4 col-sm-6 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-capitalize">{comp.name}</h5>
                <p className="card-text"> Price: Rs.{comp.price}</p>
                <p className="card-text">
                  🔧 Repairable: {comp.repairable ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComponentForm;
