'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Profile() {
  const router = useRouter();
  const [userInfo] = useState({
    name: 'Chris McBrown',
    email: 'chrismcbrown@gmail.com'
  });

  const handleEditProfile = () => {
    console.log('Edit Profile clicked');
  };

  const handleNotifications = () => {
    console.log('Notifications clicked');
  };

  const handleSecurity = () => {
    console.log('Security clicked');
  };

  const handleAbout = () => {
    console.log('About clicked');
  };

  const handleSignOut = () => {
    console.log('Sign Out clicked');
    router.push('/login');
  };

  const handleVoiceCommand = () => {
    console.log('Voice command activated');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[864px] mx-auto" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="pt-16 pb-8 px-8">
        <div className="flex items-center justify-between">
          <Link 
            href="/home"
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: '#E5E7EB', color: '#000000' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </Link>
          
          <h1 className="font-league-spartan text-4xl font-bold text-center" style={{ color: '#000000' }}>
            LIFE ECHOS
          </h1>
          
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-8">
        {/* Profile Details */}
        <div className="text-center mb-8">
          {/* User Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="font-league-spartan text-3xl font-bold text-white">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>

          {/* User Info */}
          <h2 className="font-canva-sans text-2xl font-bold mb-2" style={{ color: '#000000' }}>
            {userInfo.name}
          </h2>
          <p className="font-canva-sans text-base" style={{ color: '#4E4B4B' }}>
            {userInfo.email}
          </p>
        </div>

        {/* Account Settings & Options */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Edit Profile */}
          <button
            onClick={handleEditProfile}
            className="w-full text-left p-4 font-canva-sans text-base transition-colors duration-200 hover:bg-gray-50"
            style={{ color: '#4E4B4B', borderBottom: '1px solid #E5E5E5' }}
          >
            Edit Profile
          </button>

          {/* Notifications */}
          <button
            onClick={handleNotifications}
            className="w-full text-left p-4 font-canva-sans text-base transition-colors duration-200 hover:bg-gray-50"
            style={{ color: '#4E4B4B', borderBottom: '1px solid #E5E5E5' }}
          >
            Notifications
          </button>

          {/* Security */}
          <button
            onClick={handleSecurity}
            className="w-full text-left p-4 font-canva-sans text-base transition-colors duration-200 hover:bg-gray-50"
            style={{ color: '#4E4B4B', borderBottom: '1px solid #E5E5E5' }}
          >
            Security
          </button>

          {/* About */}
          <button
            onClick={handleAbout}
            className="w-full text-left p-4 font-canva-sans text-base transition-colors duration-200 hover:bg-gray-50"
            style={{ color: '#4E4B4B', borderBottom: '1px solid #E5E5E5' }}
          >
            About
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full text-left p-4 font-canva-sans text-base transition-colors duration-200 hover:bg-gray-50"
            style={{ color: '#3B6EFF' }}
          >
            Sign Out
          </button>
        </div>
      </main>

      {/* Voice Command Icon */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={handleVoiceCommand}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: '#3B6EFF' }}
        >
          <div className="w-8 h-8 relative">
            <Image
              src="/logo.png"
              alt="Voice Command"
              fill
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
