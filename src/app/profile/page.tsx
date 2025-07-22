'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [userInfo] = useState({
    name: 'Chris McBrown',
    email: 'chrismcbrown@gmail.com',
    subscription: 'Premium',
    joinDate: 'January 2025',
    totalNotes: 127,
    totalRecordings: 89
  });

  const handleEdit = () => {
    console.log('Edit profile clicked');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[864px] mx-auto">
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="font-league-spartan text-4xl font-bold text-center text-gray-900">
          Profile
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="font-league-spartan text-3xl font-bold text-white">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mb-8">
            <h2 className="font-canva-sans text-2xl font-bold text-gray-900 mb-2">
              {userInfo.name}
            </h2>
            <p className="font-canva-sans text-base text-gray-600 mb-4">
              {userInfo.email}
            </p>
            
            {/* Subscription Status */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
              <span className="font-canva-sans text-sm font-medium">
                ✨ {userInfo.subscription} Member
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="font-canva-sans text-2xl font-bold text-blue-500">
                {userInfo.totalNotes}
              </p>
              <p className="font-canva-sans text-sm text-gray-600">
                Notes
              </p>
            </div>
            <div className="text-center">
              <p className="font-canva-sans text-2xl font-bold text-purple-500">
                {userInfo.totalRecordings}
              </p>
              <p className="font-canva-sans text-sm text-gray-600">
                Recordings
              </p>
            </div>
            <div className="text-center">
              <p className="font-canva-sans text-2xl font-bold text-green-500">
                6
              </p>
              <p className="font-canva-sans text-sm text-gray-600">
                Months
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div className="text-center mb-8">
            <p className="font-canva-sans text-sm text-gray-500">
              Member since {userInfo.joinDate}
            </p>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-canva-sans text-lg font-medium py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
          >
            Edit Profile
          </button>
        </div>

        {/* Additional Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="space-y-4">
            <button className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span className="font-canva-sans text-base text-gray-700">Privacy Settings</span>
            </button>
            <button className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span className="font-canva-sans text-base text-gray-700">Data Export</span>
            </button>
            <button className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span className="font-canva-sans text-base text-gray-700">Help & Support</span>
            </button>
          </div>
        </div>
      </main>

      {/* Logout Button */}
      <footer className="p-8">
        <button
          onClick={handleLogout}
          className="w-full bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-canva-sans text-lg font-medium py-3 px-6 rounded-lg transition-all duration-200"
        >
          Logout
        </button>
      </footer>
    </div>
  );
}
