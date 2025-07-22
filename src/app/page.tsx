'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/create-account');
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 animate-pulse"></div>
        <p className="font-canva-sans text-lg text-gray-600">Loading Life Echo...</p>
      </div>
    </div>
  );
}
