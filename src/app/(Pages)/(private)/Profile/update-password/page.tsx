'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UpdatePassword() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear errors when typing
        setErrors({ ...errors, [name]: '' });

        // Check password strength if it's the new password field
        if (name === 'newPassword') {
            checkPasswordStrength(value);
        }

        // Check if confirm password matches new password
        if (name === 'confirmPassword') {
            if (value !== formData.newPassword) {
                setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
            } else {
                setErrors({ ...errors, confirmPassword: '' });
            }
        }
    };

    const checkPasswordStrength = (password: any) => {
        // Password strength criteria
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 6;

        // Calculate score based on criteria met
        let score = 0;
        if (hasLowerCase) score += 1;
        if (hasUpperCase) score += 1;
        if (hasNumber) score += 1;
        if (hasSpecialChar) score += 1;
        if (isLongEnough) score += 1;

        // Set message based on score
        let message = '';
        if (score === 0) message = 'Very weak';
        else if (score === 1) message = 'Weak';
        else if (score === 2) message = 'Fair';
        else if (score === 3) message = 'Good';
        else if (score === 4) message = 'Strong';
        else if (score === 5) message = 'Very strong';

        setPasswordStrength({ score, message });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
            valid = false;
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
            valid = false;
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 8 characters long';
            valid = false;
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = 'New password cannot be the same as current password';
            valid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
            valid = false;
        } else if (formData.confirmPassword !== formData.newPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/update-password`,
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }
            );
            console.log(data);
            if (data.success == false) {
                toast.error(data.message);
            }
            if (data.success) {
                toast.success(data.message);
                router.push('/Profile');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update password';
            toast.error(errorMessage);

            // Set specific error for incorrect current password
            if (error.response?.data?.message === 'Current password is incorrect') {
                setErrors({
                    ...errors,
                    currentPassword: 'Current password is incorrect'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength.score) {
            case 0:
            case 1:
                return 'bg-red-500';
            case 2:
                return 'bg-orange-500';
            case 3:
                return 'bg-yellow-500';
            case 4:
                return 'bg-green-400';
            case 5:
                return 'bg-green-600';
            default:
                return 'bg-gray-200';
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
                        <CardDescription>
                            Change your account password to keep your account secure
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className={`pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                                        placeholder="Enter your current password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <p className="text-sm text-red-500">{errors.currentPassword}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className={`pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-sm text-red-500">{errors.newPassword}</p>
                                )}

                                {/* Password strength indicator */}
                                {formData.newPassword && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">Password strength:</span>
                                            <span className={`text-xs font-medium ${passwordStrength.score >= 3 ? 'text-green-600' : 'text-red-500'
                                                }`}>
                                                {passwordStrength.message}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500">Your password should:</p>
                                            <ul className="text-xs text-gray-500 list-disc ml-5 mt-1">
                                                <li>Be at least 6 characters long</li>
                                                <li>Include uppercase and lowercase letters</li>
                                                <li>Include at least one number</li>
                                                <li>Include at least one special character</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2 mb-3">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {formData.newPassword && formData.confirmPassword &&
                                formData.newPassword === formData.confirmPassword && (
                                    <Alert className="bg-green-50 border-green-200">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-600 text-sm">
                                            Passwords match
                                        </AlertDescription>
                                    </Alert>
                                )}
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push('/Profile')}
                            >
                                Cancel
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}