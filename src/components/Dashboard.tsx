import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to your Dashboard!
          </h1>
          <p className="text-gray-600 text-lg">
            Your onboarding is complete. This is where your main application content will go.
          </p>
          
          {/* Placeholder dashboard content */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 rounded-lg p-6 h-32 flex items-center justify-center">
              <span className="text-gray-500">Dashboard Widget 1</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 h-32 flex items-center justify-center">
              <span className="text-gray-500">Dashboard Widget 2</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 h-32 flex items-center justify-center">
              <span className="text-gray-500">Dashboard Widget 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}