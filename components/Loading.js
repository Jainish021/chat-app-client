import React from 'react'

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-700 border-opacity-50"></div>
        </div>
    )
}