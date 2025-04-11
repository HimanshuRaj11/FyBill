'use client'
import React from 'react'
import { Button } from '../ui/button'
import { Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function NotCompany() {
    return (
        <div className="min-h-screen flex items-center justify-center  p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-indigo-600" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">No Company Registered</h2>
                    <p className="text-gray-600">
                        It looks like you haven't registered your company yet. Register your company to access all features and start managing your business efficiently.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link href="/Company/Register">
                        <Button
                            className="w-full py-6 text-lg flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            Register Your Company
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>

                    <p className="text-sm text-gray-500">
                        Already registered? Please refresh the page or contact support if the issue persists.
                    </p>
                </div>
            </div>
        </div>
    )
}
