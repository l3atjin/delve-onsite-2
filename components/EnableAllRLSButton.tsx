'use client';

import React, { useState } from 'react';

export default function EnableAllRLSButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleClick() {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/enable-rls', {
        method: 'POST',
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setMessage('RLS enabled on all tables successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      setMessage(`Failed to enable RLS: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <button
        className="border rounded-md px-4 py-2 mt-4 bg-green-600 text-white"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'Enabling...' : 'Enable RLS'}
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
