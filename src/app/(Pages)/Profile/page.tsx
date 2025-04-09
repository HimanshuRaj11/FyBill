'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import axios from 'axios';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    role: string;
    profilePic: string;
}

export default function ProfilePage() {
    // Example user data - replace with your actual data fetching logic
    const { User } = useSelector((state: any) => state.User);
    const user = User?.user

    const [UserData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: ""
    })
    console.log(user)
    console.log(UserData)
    const handleChange = (e: any) => {
        setUserData({ ...UserData, [e.target.name]: e.target.value })
    }

    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = async () => {
        try {
            if (isEditing) {
                // const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/update-user`, { UserData })
                console.log(UserData)
                setIsEditing(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 rounded-md">
            <div className="max-w-3xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                                <Image
                                    src={user?.profilePic || "/images/default-avatar.png"}
                                    alt="Profile Picture"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-6 px-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{UserData?.name}</h1>
                                <p className="text-sm text-gray-500">{user?.role}</p>
                            </div>
                            {
                                isEditing ?
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                                    > Edit Profile</button>
                                    :
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        Save Changes
                                    </button>

                            }
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                Contact Information
                            </h2>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            name="email"
                                            onChange={handleChange}
                                            value={user?.email}
                                            readOnly={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-md ${isEditing
                                                ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <div className="mt-1">
                                        <input
                                            type="tel"
                                            name="phone"
                                            onChange={handleChange}
                                            value={UserData?.phone}
                                            readOnly={true}
                                            className={`w-full px-3 py-2 border rounded-md ${isEditing
                                                ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                Address
                            </h2>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Street</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="street"
                                            onChange={handleChange}
                                            value={UserData?.street}
                                            readOnly={true}
                                            className={`w-full px-3 py-2 border rounded-md ${isEditing
                                                ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">City</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="city"
                                                onChange={handleChange}
                                                value={UserData?.city}
                                                readOnly={true}
                                                className={`w-full px-3 py-2 border rounded-md ${isEditing
                                                    ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'bg-gray-50 border-gray-200'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">State</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="state"
                                                onChange={handleChange}
                                                value={UserData?.state}
                                                readOnly={true}
                                                className={`w-full px-3 py-2 border rounded-md ${isEditing
                                                    ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'bg-gray-50 border-gray-200'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="zipCode"
                                            onChange={handleChange}
                                            value={UserData?.zipCode}
                                            readOnly={true}
                                            className={`w-full px-3 py-2 border rounded-md ${isEditing
                                                ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
