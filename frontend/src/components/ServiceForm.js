import React, { useEffect, useState } from "react";
import API from "../api";

function ServiceForm() {
  const [issue, setIssue] = useState("");
  const [useComponent, setUseComponent] = useState(false);
  const [component, setComponent] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [services, setServices] = useState([]);
  const [issues, setIssues] = useState([]);
  const [components, setComponents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [serviceRes, issueRes, componentRes] = await Promise.all([
        API.get("services/"),
        API.get("issues/"),
        API.get("components/"),
      ]);
      setServices(serviceRes.data);
      setIssues(issueRes.data);
      setComponents(componentRes.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue || !laborCost || (useComponent && !component)) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const serviceData = {
        issue,
        use_new: useComponent,
        labor_cost: laborCost,
      };

      if (useComponent) {
        serviceData.component = component;
      }

      await API.post("services/", serviceData);
      setIssue("");
      setComponent("");
      setLaborCost("");
      setUseComponent(false);
      fetchData();
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to submit service. Check console for details.");
    }
  };

  const getComponent = (id) => components.find((c) => c.id === id);
  const getIssue = (id) => issues.find((i) => i.id === id);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🔧 Log Service</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-5">
        <div className="mb-3">
          <label className="form-label">Select Issue</label>
          <select
            className="form-control"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          >
            <option value="">-- Select Issue --</option>
            {issues.map((i) => (
              <option key={i.id} value={i.id}>
                {i.description}
              </option>
            ))}
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="useComponent"
            checked={useComponent}
            onChange={(e) => setUseComponent(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="useComponent">
            Use New Component
          </label>
        </div>

        {useComponent && (
          <div className="mb-3">
            <label className="form-label">Select Component</label>
            <select
              className="form-control"
              value={component}
              onChange={(e) => setComponent(e.target.value)}
            >
              <option value="">-- Select Component --</option>
              {components.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Rs. {c.price})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="form-label">Labor Cost</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter labor cost"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>

      <h3 className="mb-3">🛠 Services</h3>
      {lastUpdated && (
        <p className="text-muted">Last updated: {lastUpdated}</p>
      )}

      <div className="row">
        {services.map((s) => {
          const issueObj = getIssue(s.issue);
          const compObj = getComponent(s.component);
          const compCost = s.use_new && compObj ? parseFloat(compObj.price) : 0;
          const totalCost = parseFloat(s.labor_cost) + compCost;

          return (
            <div key={s.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    Service ID: {s.id}
                  </h5>
                  <p className="card-text">
                    <strong>🪛 Issue:</strong>{" "}
                    {issueObj?.description || "Unknown"}
                  </p>
                  <p className="card-text">
                    <strong>🔧 Labor Cost:</strong> Rs. {s.labor_cost}
                  </p>
                  {compObj && (
                    <>
                      <p className="card-text">
                        <strong>🧩 Component:</strong> {compObj.name}
                      </p>
                      <p className="card-text">
                        <strong>🆕 New Component:</strong>{" "}
                        {s.use_new ? (
                          <span className="badge bg-success">Rs. {parseFloat(compObj.price).toFixed(2)}</span>
                        ) : (
                          <span className="badge bg-secondary">No</span>
                        )}
                      </p>
                    </>
                  )}
                  <p className="card-text">
                    <strong>Total Cost:</strong> Rs. {totalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ServiceForm;
