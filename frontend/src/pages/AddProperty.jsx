import React, { useState } from 'react';

const AddProperty = () => {
  const [form, setForm] = useState({ title: '', description: '', price: '', image: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    properties.push({ ...form, price: parseFloat(form.price) });
    localStorage.setItem('properties', JSON.stringify(properties));
    setSuccess(true);
    setForm({ title: '', description: '', price: '', image: '' });
  };

  return (
    <div className="mx-auto mt-20 max-w-[600px] p-8">
      <h1 className="text-3xl font-bold mb-4">Add Property</h1>
      {success && <div className="text-green-600 font-semibold mb-4">Property added successfully!</div>}
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