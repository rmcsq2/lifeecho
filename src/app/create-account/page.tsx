'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateAccount() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create account:', formData);
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <h1 className="font-league-spartan text-4xl font-bold text-center text-gray-900 mb-12">
          Create Account
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-canva-sans text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-canva-sans text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-canva-sans text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-canva-sans text-xl font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/login" 
            className="font-canva-sans text-base text-gray-600 underline hover:text-gray-800 transition-colors"
          >
            Already have an account? Login
          </Link>
        </div>

        {/* Footer Logo */}
        <div className="mt-12 flex justify-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
