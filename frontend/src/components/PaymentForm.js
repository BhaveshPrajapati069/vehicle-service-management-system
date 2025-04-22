import React, { useState, useEffect } from 'react';
import API from '../api';

function PaymentForm() {
  const [service, setService] = useState('');
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    API.get('services/').then(res => setServices(res.data));
    API.get('payments/').then(res => setPayments(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serviceId = parseInt(service);
    if (!serviceId) return alert('Please select a valid service.');

    try {
      await API.post('payments/', { service: serviceId });
      alert('✅ Payment simulated!');
      setService('');
      fetchData();
    } catch (err) {
      console.error('Payment error:', err.response?.data || err);
      alert('❌ Failed to simulate payment.');
    }
  };

  const isPaid = (serviceId) => payments.some(p => p.service === serviceId);

  const getServiceDetails = (id) => {
    const found = services.find(s => s.id === id);
    const model = found?.vehicle_model;
    return model ? `${model} (Service #${id})` : `Service #${id}`;
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">💳 Simulate Payment</h4>
      <form onSubmit={handleSubmit} className="card p-3 shadow-sm mb-4">
        <select
          className="form-control mb-3"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">-- Select Service --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id} disabled={isPaid(s.id)}>
              {getServiceDetails(s.id)} - Rs.{s.total_cost} {isPaid(s.id) ? '(Paid)' : ''}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-success w-100" disabled={!service}>
          Pay Now
        </button>
      </form>

      <h5 className="mb-3">📜 Payment History</h5>
      <ul className="list-group">
        {payments.map((p) => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{getServiceDetails(p.service)}</strong><br />
              <small className="text-muted">Paid on: {new Date(p.paid_on).toLocaleString()}</small>
            </div>
            <span className="badge bg-success text-white">Rs. {p.total_price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentForm;
