"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProcessS3Objects = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('api/processS3ObjectsEndpoint', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        setMessage('Failed to process S3 objects');
      }
    } catch (error) {
      setMessage('Error processing S3 objects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={handleProcessS3Objects}
        disabled={loading}
        className="mt-6 px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Process S3 Objects'}
      </button>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </main>
  );
}
