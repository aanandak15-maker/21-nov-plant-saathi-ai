import React from 'react';

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            </div>

            {/* Weather Card Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm h-48">
                <div className="flex justify-between">
                    <div className="space-y-3 w-1/2">
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-xl h-32 flex flex-col justify-center items-center space-y-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>

            {/* Fields Grid Skeleton */}
            <div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white p-4 rounded-xl h-40 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-20 bg-gray-200 rounded w-full"></div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
