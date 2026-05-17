import React, { useState } from 'react';

const AddProperty = () => {
  const [form, setForm] = useState({ title: '', description: '', price: '', image: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      setError('You must be logged in to add a property.');
      return;
    }

    try {
      const response = await fetch('/api/properties/property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, ...form, price: parseFloat(form.price) })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Property could not be added');
      }

      setMessage('Property added successfully!');
      setForm({ title: '', description: '', price: '', image: '' });
    } catch (err) {
      setError(err.message || 'Property creation failed');
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-[600px] p-8">
      <h1 className="text-3xl font-bold mb-4">Add Property</h1>
      {message && <div className="text-green-600 font-semibold mb-4">{message}</div>}
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Property Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          rows={3}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Property</button>
      </form>
    </div>
  );
};

export default AddProperty; 