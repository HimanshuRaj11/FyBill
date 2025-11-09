
"use client"

import React from 'react';

export default function PreLoader() {

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-12">
            {/* Orbital Loader */}
            <div className="relative w-12 h-12 rounded-full animate-spin"
                style={{
                    boxShadow: '0 0 0 3px currentColor inset',
                    animationDuration: '7s',
                    color: '#3b82f6'
                }}>
                {/* First orbiting circle */}
                <div
                    className="absolute rounded-full animate-spin"
                    style={{
                        width: '25px',
                        height: '25px',
                        top: 'calc(100% + 3px)',
                        left: 'calc(50% - 12.5px)',
                        boxShadow: '0 0 0 3px currentColor inset',
                        transformOrigin: '50% -28px',
                        animationDuration: '1.5s',
                        color: '#3b82f6'
                    }}
                />

                {/* Second orbiting circle (delayed) */}
                <div
                    className="absolute rounded-full animate-spin"
                    style={{
                        width: '25px',
                        height: '25px',
                        top: 'calc(100% + 3px)',
                        left: 'calc(50% - 12.5px)',
                        boxShadow: '0 0 0 3px currentColor inset',
                        transformOrigin: '50% -28px',
                        animationDuration: '1.5s',
                        animationDelay: '-0.75s',
                        color: '#3b82f6'
                    }}
                />
            </div>

            {/* Progress Section */}

        </div>
    );
}