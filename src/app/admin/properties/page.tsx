import React from 'react'

const PropertiesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your property listings
            </p>
          </div>
          <hr className="border-gray-200" />
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Property components will be mapped here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPage