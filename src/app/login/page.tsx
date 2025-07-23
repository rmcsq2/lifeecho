'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
    console.log('Login:', formData);
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        {/* Header */}
        <h1 className="font-league-spartan text-4xl font-bold text-center mb-12" style={{ color: 'var(--foreground)' }}>
          Login
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full font-canva-sans text-xl font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            style={{ 
              backgroundColor: 'var(--primary-blue)', 
              color: 'var(--primary-foreground)' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <Link 
            href="/forgot-password" 
            className="font-canva-sans text-base text-gray-600 hover:text-gray-800 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Create Account Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/create-account" 
            className="font-canva-sans text-base text-gray-600 underline hover:text-gray-800 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
