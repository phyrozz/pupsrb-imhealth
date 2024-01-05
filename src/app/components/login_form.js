'use client'

import { useState } from 'react';
// Import Font Awesome and configuration
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform your login logic here using the email and password state values
    console.log('Login submitted:', { email, password });
  };

  return (
    <div className="container py-10 px-5 m-5 w-96 bg-slate-900 rounded-lg shadow-xl shadow-neutral-600">
      <h2 className="text-3xl font-extralight mb-5">Sign in</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="flex flex-row justify-between mt-10">
          <a href="/"
            className="w-32 bg-slate-600 text-white p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring focus:ring-indigo-200 transition-all text-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </a>
          <button
            type="submit"
            className="w-32 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 transition-all"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
