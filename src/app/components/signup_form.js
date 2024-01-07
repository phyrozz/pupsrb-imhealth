"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import supabase, { signUp } from '../../supabase';

export default function SignUpForm() {
	const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Password validation logic
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      // Call signUp function from supabase.js
			const user = await signUp(email, password);

			console.log('Sign-up successful:', user);
			// Perform additional actions if needed
			// Redirect or navigate to another page
			router.push('/home');
		} catch (error) {
			console.error('Sign-up error:', error.message);
			setPasswordError(error.message);
		}
  };

  return (
    <div className="container py-10 px-5 m-5 w-96 bg-slate-900 rounded-lg shadow-xl shadow-neutral-600">
      <h2 className="text-3xl font-extralight mb-5">Create an Account</h2>
      <form onSubmit={handleSignUp}>
      <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border-gray-500 rounded-md focus:ring focus:ring-indigo-200 transition-all text-slate-950"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border-gray-500 rounded-md focus:ring focus:ring-indigo-200 transition-all text-slate-950"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 p-2 w-full border-gray-500 rounded-md focus:ring focus:ring-indigo-200 transition-all text-slate-950"
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>
        <div className="flex flex-row justify-between mt-10">
          <a href="#" onClick={() => router.replace("/")} className="w-32 bg-slate-600 text-white p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring focus:ring-indigo-200 transition-all text-center">
            Back
          </a>
          <button type="submit" className="w-32 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 transition-all">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
