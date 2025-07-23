'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/create-account');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 animate-pulse" style={{ backgroundColor: 'var(--primary-blue)' }}></div>
        <p className="font-canva-sans text-lg text-gray-600">Loading Life Echo...</p>
      </div>
    </div>
  );
}
