'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PremiumLogin() {
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
    console.log('Premium Login:', formData);
    router.push('/home');
  };

  const handleUpgrade = () => {
    console.log('Upgrade to Premium clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex flex-col items-center justify-center px-8 py-12">
      <div className="w-full max-w-sm">
        {/* Premium Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-4 py-2 rounded-full font-canva-sans text-sm font-medium">
            ✨ PREMIUM
          </div>
        </div>

        {/* Header */}
        <h1 className="font-league-spartan text-4xl font-bold text-center text-gray-900 mb-12">
          Premium Login
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
              className="w-full px-4 py-3 rounded-lg border-2 border-gradient-to-r from-blue-200 to-yellow-200 font-canva-sans text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 rounded-lg border-2 border-gradient-to-r from-blue-200 to-yellow-200 font-canva-sans text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-canva-sans text-xl font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Login
          </button>

          {/* Upgrade to Premium Button */}
          <button
            type="button"
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-canva-sans text-xl font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
          >
            ✨ Upgrade to Premium
          </button>
        </form>

        {/* Return to Standard Login */}
        <div className="mt-8 text-center">
          <Link 
            href="/login" 
            className="font-canva-sans text-base text-gray-600 underline hover:text-gray-800 transition-colors"
          >
            Return to standard login
          </Link>
        </div>
      </div>
    </div>
  );
}
