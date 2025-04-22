import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ComponentForm from './components/ComponentForm';
import VehicleForm from './components/VehicleForm';
import IssueForm from './components/IssueForm';
import ServiceForm from './components/ServiceForm';
import PaymentForm from './components/PaymentForm';
import RevenueChart from './components/RevenueChart';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <h2 className="mb-4">🚗 Vehicle Service Management System</h2>
        <nav className="mb-4">
          <Link className="btn btn-primary me-2" to="/components">Components</Link>
          <Link className="btn btn-primary me-2" to="/vehicles">Vehicles</Link>
          <Link className="btn btn-primary me-2" to="/issues">Issues</Link>
          <Link className="btn btn-primary me-2" to="/services">Services</Link>
          <Link className="btn btn-primary me-2" to="/payments">Payments</Link>
          <Link className="btn btn-success" to="/revenue">Revenue</Link>
        </nav>

        <Routes>
          <Route path="/components" element={<ComponentForm />} />
          <Route path="/vehicles" element={<VehicleForm />} />
          <Route path="/issues" element={<IssueForm />} />
          <Route path="/services" element={<ServiceForm />} />
          <Route path="/payments" element={<PaymentForm />} />
          <Route path="/revenue" element={<RevenueChart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
