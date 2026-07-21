import React, { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      // Check if response is JSON before parsing
      // (Render free tier returns HTML during cold start wake-up)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('The server is warming up. Please wait a few seconds and try again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-[600px] p-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
          {error}
        </div>
      )}
      {submitted ? (
        <div className="text-green-600 font-semibold text-lg">Thank you for contacting us! We'll get back to you shortly.</div>
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
          <button 
            type="submit" 
            disabled={sending}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded transition-colors font-semibold cursor-pointer"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact; 