'use client'
import React, { useState } from 'react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically handle the password reset logic, e.g., API call
    setMessage('Password reset link has been sent to your email.');
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='border-2 border-gray-300 rounded-md p-2'
        />
        <button type="submit" className='bg-blue-500 text-white p-2 rounded-md'>Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
