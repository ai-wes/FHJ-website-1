"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the dashboard choice page
    router.push('/admin_9852587137/simple');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Redirecting to admin dashboard...</p>
      </div>
    </div>
  );
}