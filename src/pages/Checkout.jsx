import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Checkout() {
  const location = useLocation();


  const patientId = location.state?.patientId || '';
  const patientName = location.state?.patientName || '';
  const checkinDate = location.state?.checkinDate || '';
  const checkinTime = location.state?.checkinTime || '';
  const paymentMethod = location.state?.paymentMethod || '';


  const [description, setDescription] = useState('Consultation');
  const [amount, setAmount] = useState('');
  const [cash, setCash] = useState('');

  const subtotal = parseFloat(amount) || 0;
  const tax = subtotal * 0.13;
  const total = subtotal + tax;
  const change = (parseFloat(cash) || 0) - total;

  return (
    <div style={{ display: 'flex' }}>
      <div className="main-content">

        <div className="p-6">
          <div className="bg-white p-6 rounded shadow md:w-2/3 mx-auto">
            {/*  Billing Header */}
            <h2 className="text-xl font-semibold mb-6 text-center">PARTICULARS</h2>

            {/* Billing Form */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-semibold text-sm mb-1">Billing Description</label>
                <select
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option>Consultation</option>
                  <option>Therapy Session</option>
                  <option>Lab Test</option>
                  <option>X-Ray</option>
                  <option>Procedure</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-sm mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Payment Method */}
            <h3 className="font-semibold mb-2">PAYMENT METHOD</h3>
            <p className="mb-4 text-sm uppercase">{paymentMethod || 'N/A'}</p>

            {/* Cash Input */}
            <input
              type="number"
              value={cash}
              onChange={e => setCash(e.target.value)}
              placeholder="Enter cash amount"
              className="border p-2 w-full rounded mb-4"
            />

            {/* Summary */}
            <div className="border-t pt-4 text-right">
              <p className="mb-1">Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span></p>
              <p className="mb-1">Harmonized Sales Tax (HST): <span className="font-medium">13%</span></p>
              <p className="mb-1">Tax Amount: <span className="font-medium">${tax.toFixed(2)}</span></p>
              <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
              {cash && (
                <p className="text-sm mt-2 text-green-700">
                  Change: ${change.toFixed(2)}
                </p>
              )}
            </div>

            {/* Patient Summary */}
            <div className="mt-6 text-sm text-gray-600">
              <p>Patient: {patientName || 'N/A'}</p>
              <p>ID: {patientId || 'N/A'}</p>
              <p>Check-In: {checkinDate || 'N/A'} at {checkinTime || 'N/A'}</p>
            </div>

            {/* Final Checkout Button */}
            <button
              className="mt-6 w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700"
            >
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
