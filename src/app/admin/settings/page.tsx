import React from 'react'

const page = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Configure your application settings</p>
                </div>
            </div>
        </div>
    )
}

export default page