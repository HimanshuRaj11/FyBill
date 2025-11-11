import React from 'react'



export default function ProductCardSkeleton() {
    return (
        <div>
            <div className="bg-white border rounded-lg p-2 shadow-sm">
                <div className="flex flex-row animate-pulse">
                    <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-32 mt-1"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20 mt-1 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-24 mt-2 animate-pulse"></div>
            </div>
        </div>
    )
}

