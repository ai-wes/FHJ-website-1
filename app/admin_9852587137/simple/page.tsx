"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminChoice() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Admin Interface</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Dashboard */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Sam Moore Style Dashboard</h2>
            <p className="text-gray-600 mb-4">
              Professional dashboard with the blue navigation bar, content manager table, 
              calendar, and multi-platform posting - exactly like the screenshots.
            </p>
            <Link href="/admin_9852587137/dashboard">
              <Button className="w-full">Launch Dashboard →</Button>
            </Link>
          </Card>

          {/* Original Interface */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Simple Admin Interface</h2>
            <p className="text-gray-600 mb-4">
              Your original admin interface with basic article creation and management 
              in a simple, clean layout.
            </p>
            <Link href="/admin_9852587137/original">
              <Button variant="outline" className="w-full">Use Simple Interface →</Button>
            </Link>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Both interfaces connect to the same backend at:</p>
          <code className="bg-gray-200 px-2 py-1 rounded">
            {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}
          </code>
        </div>
      </Card>
    </div>
  );
}