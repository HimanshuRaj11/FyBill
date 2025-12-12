import React from 'react'



export default function ProductCardSkeleton() {
    return (
        <div>
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-2 shadow-sm dark:shadow-gray-900/50">
                <div className="flex flex-row animate-pulse">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-1"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-1 animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-2 animate-pulse"></div>
            </div>
        </div>
    )
}