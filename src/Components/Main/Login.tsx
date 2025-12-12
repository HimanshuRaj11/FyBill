"use client"
import axios from 'axios'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { FetchUser } from '@/app/Redux/Slice/User.slice'
import { useRouter } from 'next/navigation'
import { FetchCompany } from '@/app/Redux/Slice/Company.slice'

const base_url = process.env.NEXT_PUBLIC_BASE_URL

interface InterfaceInitialInputData {
    email: string,
    password: string,
}

interface ValidationErrors {
    email: string,
    password: string,
}

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();

    const InitialInputData: InterfaceInitialInputData = {
        email: "",
        password: ""
    }

    const initialValidationErrors: ValidationErrors = {
        email: "",
        password: ""
    }

    const [InputData, setInputData] = useState(InitialInputData)
    const [errors, setErrors] = useState(initialValidationErrors)
    const [isFormValid, setIsFormValid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'email':
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                return '';
            default:
                return '';
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

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


    // Handle Submit
    const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            email: validateField('email', InputData.email),
            password: validateField('password', InputData.password)
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (hasErrors) {
            toast.error('Please fix the validation errors before submitting');
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await axios.post(`${base_url}/api/v1/auth/Login`, InputData)

            if (data.success) {
                router.push('/Dashboard')
                dispatch(FetchUser() as any);
                dispatch(FetchCompany() as any);
                toast.success(data.message)
                return;
            }
            else {
                toast.error(data.message)
                return;
            }
        } catch (error: any) {

            toast.error(error.response.data.message || 'Login failed');

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/70">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Welcome Back</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">Sign in to access your account</p>

                <form className="space-y-6" onSubmit={HandleSubmit}>
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusedField === 'email' ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                <FiMail className="h-5 w-5" />
                            </div>
                            <input
                                onChange={handleInputChange}
                                onFocus={() => handleFocus('email')}
                                onBlur={handleBlur}
                                value={InputData.email}
                                name='email'
                                type="email"
                                className={`pl-10 w-full py-3 px-4 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${errors.email ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                                placeholder="Email Address"
                                aria-label="Email Address"
                            />
                            {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">{errors.email}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusedField === 'password' ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                <FiLock className="h-5 w-5" />
                            </div>
                            <input
                                onChange={handleInputChange}
                                onFocus={() => handleFocus('password')}
                                onBlur={handleBlur}
                                value={InputData.password}
                                name='password'
                                type={showPassword ? "text" : "password"}
                                className={`pl-10 w-full py-3 px-4 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${errors.password ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                                placeholder="Password"
                                aria-label="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                            </button>
                            {errors.password && <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200">
                            Forgot password?
                        </Link>
                        <div className="text-gray-600 dark:text-gray-400">
                            {`Don't`} have an account? <Link href={'/Register'} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200">Sign Up</Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${isFormValid && !isLoading
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 hover:from-indigo-700 hover:to-blue-700 dark:hover:from-indigo-800 dark:hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                            : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                            }`}
                        aria-label="Login"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    By signing in, you agree to our <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">Terms of Service</Link> and <Link href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}