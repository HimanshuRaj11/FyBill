'use client'


import React, { useCallback, useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, MoreHorizontal, ChevronDown, Filter } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { useSelector } from 'react-redux';
import { Button } from '@/Components/ui/button';
import DashboardTopCards from '@/Components/Other/DashboardTopCards';
import Link from 'next/link';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function StaffDetailsCard({ params }: { params: Promise<{ StaffId: string }> }) {
    const { Company } = useSelector((state: any) => state.Company)
    const router = useRouter();
    const [showOptions, setShowOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const { StaffId } = React.use(params);
    const [staffMember, setStaffMember] = useState<any>({})
    const Address = staffMember?.address?.street + " " + staffMember?.address?.city + " " + staffMember?.address?.state

    const [Invoice, setInvoice] = useState([])
    const [startDate, setStartDate] = useState(moment().startOf('day').toDate())
    const [endDate, setEndDate] = useState(moment().endOf('day').toDate())
    const [isFilterOpen, setIsFilterOpen] = useState(false)


    const [dateRange, setDateRange] = useState('Today')

    const HandleDateRange = (dateRange: string) => {
        setDateRange(dateRange);
        if (dateRange == "Today") {
            setStartDate(moment().startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Yesterday") {
            setStartDate(moment().subtract(1, 'day').startOf('day').toDate())
            setEndDate(moment().subtract(1, 'day').endOf('day').toDate())
        }
        if (dateRange == "Last 7 days") {
            setStartDate(moment().subtract(7, 'days').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Last 30 days") {
            setStartDate(moment().subtract(30, 'days').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Last 90 days") {
            setStartDate(moment().subtract(90, 'days').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Last 6 Months") {
            setStartDate(moment().subtract(6, 'months').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }
        if (dateRange == "Last 1 Year") {
            setStartDate(moment().subtract(1, 'year').startOf('day').toDate())
            setEndDate(moment().endOf('day').toDate())
        }

    }
    const fetchStaffMember = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/${StaffId}`, { withCredentials: true })
            if (data.success) {
                setStaffMember(data.Staff)
            }
            setIsLoading(false)

        } catch (error) {
            console.log(error);

        }
    }, [StaffId])

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true)
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/delete`, { _id: id }, { withCredentials: true })
            if (data.success) {
                toast.success(data.message)
                router.push('/Staff')
            }
            setIsLoading(false)
        } catch (error: any) {
            toast.error(error.response.data.error)
            setIsLoading(false)
        }
    }
    const FetchInvoice = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/${StaffId}/invoice`, { startDate, endDate })
            setInvoice(data.invoices)

            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }, [StaffId, startDate, endDate])
    useEffect(() => {
        // setDateRange("Today");
        FetchInvoice()
    }, [FetchInvoice])

    useEffect(() => {
        fetchStaffMember()
    }, [fetchStaffMember])


    return (
        <div>


            <div className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row">
                    {/* Staff Image */}
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {staffMember?.imageUrl ? (
                                <Image
                                    width={2400}
                                    height={2100}
                                    src={staffMember?.imageUrl}
                                    alt={`${staffMember?.name}`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User size={40} className="text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Staff Details */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-gray-800">{staffMember?.name}</h2>

                            <div className="relative">
                                {/* <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                                >
                                    <MoreHorizontal size={20} />
                                </button> */}

                                {/* {showOptions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    // if (onEdit) onEdit(staffMember?.id);
                                                    setShowOptions(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // handleDelete(staffMember._id);
                                                    setShowOptions(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>

                        <div className="text-lg font-medium text-blue-600 mb-4">
                            {staffMember?.position}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-600">
                                <Briefcase size={18} className="mr-2" />
                                <span>{staffMember?.role}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MapPin size={18} className="mr-2" />
                                <span>{Address}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Mail size={18} className="mr-2" />
                                <span className="truncate">{staffMember?.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Phone size={18} className="mr-2" />
                                <span>{staffMember?.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar size={18} className="mr-2" />
                                <span>Hired: {moment(staffMember?.joinedAt).format('DD/MM/YYYY')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className=" p-2">
                <h1 className="text-xl font-extrabold text-gray-800 mb-4">{dateRange} Invoice Data</h1>
            </div>


            {/* Staff DashBoard */}
            <DashboardTopCards Invoice={Invoice} />


            <>
                <div className="flex justify-end flex-col sm:flex-row gap-3 mb-6">

                    <div className="relative">
                        <Button
                            variant="outline"
                            className="!rounded-lg whitespace-nowrap flex items-center gap-2"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter className="h-4 w-4" />
                            Filter
                            <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </Button>
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                                <h3 className="font-medium mb-4 text-gray-800">Filter Options</h3>
                                <div className="space-y-4">
                                    {/* Date Range Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                        <select
                                            value={dateRange}
                                            onChange={(e) => { HandleDateRange(e.target.value) }}
                                            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
                                            <option value="Today">Today</option>
                                            <option value="Yesterday">Yesterday</option>
                                            <option value="Last 7 days">Last 7 days</option>
                                            <option value="Last 30 days">Last 30 days</option>
                                            <option value="Last 90 days">Last 90 days</option>
                                            <option value="Last 6 Months">Last 6 Months</option>
                                            <option value="Last 1 Year">Last 1 Year</option>
                                            <option value="Custom">Custom Range</option>
                                        </select>
                                    </div>

                                    {/* Custom Date Range Section */}
                                    {dateRange === 'Custom' && (
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Date Range</h4>

                                            {/* Date Range Inputs */}
                                            <div className="grid grid-cols-1 gap-3">
                                                {/* Start Date */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                                                    <div className="relative">
                                                        <DatePicker
                                                            selected={startDate}
                                                            onChange={(date: any) => setStartDate(date)}
                                                            selectsStart
                                                            startDate={startDate}
                                                            endDate={endDate}
                                                            maxDate={new Date()}
                                                            placeholderText="Select start date"
                                                            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                                                            dateFormat="MM/dd/yyyy"
                                                            showPopperArrow={false}
                                                            popperClassName="custom-datepicker-popper"
                                                        />
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* End Date */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                                                    <div className="relative">
                                                        <DatePicker
                                                            selected={endDate}
                                                            onChange={(date: any) => setEndDate(date)}
                                                            selectsEnd
                                                            startDate={startDate}
                                                            endDate={endDate}
                                                            minDate={startDate}
                                                            maxDate={new Date()}
                                                            placeholderText="Select end date"
                                                            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                                                            dateFormat="MM/dd/yyyy"
                                                            showPopperArrow={false}
                                                            popperClassName="custom-datepicker-popper"
                                                        />
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Clear Dates Button */}
                                            <div className="mt-3 pt-2 border-t border-gray-200">
                                                <button
                                                    onClick={() => {
                                                        const today = new Date();
                                                        setStartDate(today);
                                                        setEndDate(today);
                                                    }}
                                                    className="text-xs text-red-600 hover:text-red-700 focus:outline-none focus:underline transition-colors"
                                                >
                                                    Clear dates
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                        )}
                    </div>
                </div>

            </>
            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    {
                                        Company?.branch?.length > 0 && (
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                        )
                                    }
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode of Payment</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 ">
                                {Invoice?.map((invoice: any) => (
                                    <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                                            <Link href={`/Invoice/${invoice.invoiceId}`} className='text-blue-500'>
                                                #{invoice.invoiceId}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> {invoice.clientName}</td>
                                        {
                                            Company?.branch?.length > 0 && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice?.branchId?.branchName}</td>
                                            )
                                        }
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.currency}{invoice.grandTotal}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">{invoice.paymentMode} </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(invoice.createdAt).format('MMM DD, YYYY')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Link href={`/Invoice/${invoice.invoiceId}`} className='text-blue-500'>View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}


