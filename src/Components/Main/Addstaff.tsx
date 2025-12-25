'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, UserPlus, Mail, Phone, Shield, Lock, Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const staffSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
    role: z.enum(['manager', 'staff', 'admin', 'supervisor']),
    password: z.string()
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    branchId: z.string().or(z.literal(""))
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

type StaffFormData = z.infer<typeof staffSchema>

export default function AddStaff({ setShowAddStaffModal }: { setShowAddStaffModal: (show: boolean) => void }) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [branch, setBranch] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema)
    })

    const { User } = useSelector((state: any) => state.User);
    const user = User
    const router = useRouter()

    // Watch password for strength indicator
    const password = watch('password', '')
    const confirmPassword = watch('confirmPassword', '')

    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return { strength: 0, label: '', color: '' }

        let strength = 0
        if (pwd.length >= 6) strength += 25
        if (pwd.length >= 8) strength += 25
        if (/[A-Z]/.test(pwd)) strength += 25
        if (/[0-9]/.test(pwd)) strength += 25

        if (strength <= 25) return { strength, label: 'Weak', color: 'bg-red-500 dark:bg-red-600' }
        if (strength <= 50) return { strength, label: 'Fair', color: 'bg-orange-500 dark:bg-orange-600' }
        if (strength <= 75) return { strength, label: 'Good', color: 'bg-yellow-500 dark:bg-yellow-600' }
        return { strength, label: 'Strong', color: 'bg-green-500 dark:bg-green-600' }
    }

    const passwordStrength = getPasswordStrength(password)

    const fetchBranch = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/branch/fetch`)
            setBranch(data.branches)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            toast.error('Failed to fetch branches')
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchBranch()
    }, [])

    const onSubmit = async (Data: StaffFormData) => {
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/Register`, Data, { withCredentials: true })
            if (data.success) {
                toast.success(data.message || 'Staff added successfully')
                setShowAddStaffModal(false)
                router.refresh()
                reset()
            }
            if (data.error) {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong')
            return
        }
    }

    if (user?.role !== "admin" && user?.role !== "Owner") {
        toast.error("You are not authorized to add staff")
        router.back()
        return null
    }

    return (
        <div className="w-full p-6 bg-white dark:bg-gray-800">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 flex items-center justify-center shadow-lg">
                        <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Add New Staff Member
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Fill in the details to register a new team member
                        </p>
                    </div>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <UserPlus className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            {...register('name')}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.name && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                        >
                            <AlertCircle className="h-4 w-4" />
                            {errors.name.message}
                        </motion.p>
                    )}
                </motion.div>

                {/* Email */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="john.doe@example.com"
                        />
                    </div>
                    {errors.email && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                        >
                            <AlertCircle className="h-4 w-4" />
                            {errors.email.message}
                        </motion.p>
                    )}
                </motion.div>

                {/* Phone */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="tel"
                            {...register('phone')}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="+1234567890"
                        />
                    </div>
                    {errors.phone && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                        >
                            <AlertCircle className="h-4 w-4" />
                            {errors.phone.message}
                        </motion.p>
                    )}
                </motion.div>

                {/* Role and Branch - Two Column Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Role */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <select
                                {...register('role')}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
                            >
                                <option value="">Select role</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                                <option value="supervisor">Supervisor</option>
                            </select>
                        </div>
                        {errors.role && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                            >
                                <AlertCircle className="h-4 w-4" />
                                {errors.role.message}
                            </motion.p>
                        )}
                    </motion.div>

                    {/* Branch */}
                    {branch?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Branch
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Building2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <select
                                    {...register('branchId')}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
                                >
                                    <option value="">Select branch</option>
                                    {branch?.map((branch: any) => (
                                        <option key={branch._id} value={branch._id}>
                                            {branch.branchName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Password */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600 dark:text-gray-400">Password strength</span>
                                <span className={`text-xs font-semibold ${passwordStrength.strength <= 25 ? 'text-red-600 dark:text-red-400' :
                                    passwordStrength.strength <= 50 ? 'text-orange-600 dark:text-orange-400' :
                                        passwordStrength.strength <= 75 ? 'text-yellow-600 dark:text-yellow-400' :
                                            'text-green-600 dark:text-green-400'
                                    }`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${passwordStrength.strength}%` }}
                                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                />
                            </div>
                        </motion.div>
                    )}

                    {errors.password && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                        >
                            <AlertCircle className="h-4 w-4" />
                            {errors.password.message}
                        </motion.p>
                    )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword')}
                            className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Password Match Indicator */}
                    {confirmPassword && password && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2"
                        >
                            {password === confirmPassword ? (
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Passwords match
                                </p>
                            ) : (
                                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    Passwords don't match
                                </p>
                            )}
                        </motion.div>
                    )}

                    {errors.confirmPassword && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                        >
                            <AlertCircle className="h-4 w-4" />
                            {errors.confirmPassword.message}
                        </motion.p>
                    )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="pt-2"
                >
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Registering...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5" />
                                <span>Register Staff Member</span>
                            </>
                        )}
                    </button>
                </motion.div>
            </form>
        </div>
    )
}