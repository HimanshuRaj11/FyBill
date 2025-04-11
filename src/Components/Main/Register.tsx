'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import axios from "axios"
import { toast } from "react-toastify"
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FetchUser } from '@/app/Redux/Slice/User.slice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

const base_url = process.env.NEXT_PUBLIC_BASE_URL
interface InterfaceInitialInputData {
    name: string,
    phone: string,
    email: string,
    password: string,
}

interface ValidationErrors {
    name: string,
    phone: string,
    email: string,
    password: string,
}

export default function Register() {
    const dispatch = useDispatch();
    const router = useRouter();
    const initialInputData: InterfaceInitialInputData = {
        name: "",
        phone: "",
        email: "",
        password: ""
    }

    const initialValidationErrors: ValidationErrors = {
        name: "",
        phone: "",
        email: "",
        password: ""
    }

    const [InputData, setInputData] = useState(initialInputData)
    const [errors, setErrors] = useState(initialValidationErrors)
    const [isFormValid, setIsFormValid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.length < 3) return 'Name must be at least 3 characters';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(value)) return 'Please enter a valid 10-digit phone number';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return '';
            default:
                return '';
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Update input data
        setInputData((prevValue) => {
            return { ...prevValue, [name]: value }
        })

        // Validate the field and update errors
        const errorMessage = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage
        }));
    }

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    }

    const handleBlur = () => {
        setFocusedField(null);
    }

    // Check if form is valid whenever input data or errors change
    useEffect(() => {
        const isAllFieldsFilled = Object.values(InputData).every(value => value.trim() !== '');
        const hasNoErrors = Object.values(errors).every(error => error === '');

        setIsFormValid(isAllFieldsFilled && hasNoErrors);
    }, [InputData, errors]);

    const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate all fields before submission
        const newErrors = {
            name: validateField('name', InputData.name),
            email: validateField('email', InputData.email),
            phone: validateField('phone', InputData.phone),
            password: validateField('password', InputData.password)
        };

        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (hasErrors) {
            toast.error('Please fix the validation errors before submitting');
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await axios.post(`${base_url}/api/v1/auth/Register`, InputData)
            if (data.success) {
                router.push('/Dashboard')
                dispatch(FetchUser() as any);
                toast.success(data.message)
                setInputData(initialInputData)
            }
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || 'Registration failed');
            } else {
                toast.error('An error occurred during registration');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen  flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
                <p className="text-gray-600 text-center mb-8">Join us to manage your business efficiently</p>

                <form className="space-y-6" onSubmit={HandleSubmit}>
                    <div className="space-y-4">
                        {/* Name Input */}
                        <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusedField === 'name' ? 'text-indigo-500' : 'text-gray-400'}`}>
                                <FiUser className="h-5 w-5" />
                            </div>
                            <input
                                onChange={handleInputChange}
                                onFocus={() => handleFocus('name')}
                                onBlur={handleBlur}
                                name='name'
                                value={InputData.name}
                                type="text"
                                className={`pl-10 w-full py-3 px-4 rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all duration-200`}
                                placeholder="Full Name"
                                aria-label="Full Name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>}
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusedField === 'email' ? 'text-indigo-500' : 'text-gray-400'}`}>
                                <FiMail className="h-5 w-5" />
                            </div>
                            <input
                                onChange={handleInputChange}
                                onFocus={() => handleFocus('email')}
                                onBlur={handleBlur}
                                name='email'
                                value={InputData.email}
                                type="email"
                                className={`pl-10 w-full py-3 px-4 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all duration-200`}
                                placeholder="Email Address"
                                aria-label="Email Address"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
                        </div>

                        {/* Phone Input */}
                        <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusedField === 'phone' ? 'text-indigo-500' : 'text-gray-400'}`}>
                                <FiPhone className="h-5 w-5" />
                            </div>
                            <input
                                onChange={handleInputChange}
                                onFocus={() => handleFocus('phone')}
                                onBlur={handleBlur}
                                name='phone'
                                value={InputData.phone}
                                type="text"
                                className={`pl-10 w-full py-3 px-4 rounded-lg border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all duration-200`}
                                placeholder="Phone Number"
                                aria-label="Phone Number"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1 ml-1">{errors.phone}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusedField === 'password' ? 'text-indigo-500' : 'text-gray-400'}`}>
                                <FiLock className="h-5 w-5" />
                            </div>
                            <input
                                onChange={handleInputChange}
                                onFocus={() => handleFocus('password')}
                                onBlur={handleBlur}
                                name='password'
                                value={InputData.password}
                                type={showPassword ? "text" : "password"}
                                className={`pl-10 w-full py-3 px-4 rounded-lg border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500'} focus:outline-none focus:ring-2 transition-all duration-200`}
                                placeholder="Password"
                                aria-label="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                            </button>
                            {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">
                            Forgot password?
                        </Link>
                        <div className="text-gray-600">
                            Already have an account? <Link href={'/Login'} className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">Sign In</Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${isFormValid && !isLoading
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Register"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    By registering, you agree to our <Link href="#" className="text-indigo-600 hover:text-indigo-800">Terms of Service</Link> and <Link href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}
