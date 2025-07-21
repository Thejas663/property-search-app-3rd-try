import React, { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto mt-20 max-w-[600px] p-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      {submitted ? (
        <div className="text-green-600 font-semibold">Thank you for contacting us!</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="border p-2 rounded"
            rows={4}
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Send</button>
        </form>
      )}
    </div>
  );
};

export default Contact; 