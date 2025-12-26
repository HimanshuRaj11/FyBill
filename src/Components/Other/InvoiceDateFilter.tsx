'use client'
import React, { useState } from 'react'
import { useGlobalContext } from '@/context/contextProvider'
import { Calendar, ChevronDown, Filter } from 'lucide-react'
import moment from 'moment'

export default function InvoiceDateFilter() {
  const {
    dateRange,
    setDateRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useGlobalContext()

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState(dateRange)
  const [tempStartDate, setTempStartDate] = useState(startDate)
  const [tempEndDate, setTempEndDate] = useState(endDate)

  const HandleDateRangeChange = (range: string) => {
    setTempDateRange(range)
    if (range == "Today") {
      setTempStartDate(moment().startOf('day').toDate())
      setTempEndDate(moment().endOf('day').toDate())
    }
    if (range == "Yesterday") {
      setTempStartDate(moment().subtract(1, 'day').startOf('day').toDate())
      setTempEndDate(moment().subtract(1, 'day').endOf('day').toDate())
    }
    if (range == "Last 7 days") {
      setTempStartDate(moment().subtract(7, 'days').startOf('day').toDate())
      setTempEndDate(moment().endOf('day').toDate())
    }
    if (range == "Last 30 days") {
      setTempStartDate(moment().subtract(30, 'days').startOf('day').toDate())
      setTempEndDate(moment().endOf('day').toDate())
    }
    if (range == "Last 90 days") {
      setTempStartDate(moment().subtract(90, 'days').startOf('day').toDate())
      setTempEndDate(moment().endOf('day').toDate())
    }
    if (range == "Last 6 Months") {
      setTempStartDate(moment().subtract(6, 'months').startOf('day').toDate())
      setTempEndDate(moment().endOf('day').toDate())
    }
    if (range == "Last 1 Year") {
      setTempStartDate(moment().subtract(1, 'year').startOf('day').toDate())
      setTempEndDate(moment().endOf('day').toDate())
    }
    if (range == "Custom") {
      setTempStartDate(moment().startOf('day').toDate())
      setTempEndDate(moment().endOf('day').toDate())
    }
  }

  const handleApply = () => {
    setDateRange(tempDateRange)
    setStartDate(tempStartDate)
    setEndDate(tempEndDate)
    setIsFilterOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-blue-500 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filter by Date</span>
        <span className="sm:hidden">Filter</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
      </button>

      {isFilterOpen && (
        <div className="">
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute  mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">
              {/* Date Range Selector */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                  Select Date Range
                </label>
                <select
                  value={tempDateRange}
                  onChange={(e) => { HandleDateRangeChange(e.target.value) }}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-colors"
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
              {tempDateRange === 'Custom' && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-blue-100 dark:border-blue-800/50">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                    Custom Date Range
                  </h4>

                  {/* Date Range Inputs */}
                  <div className="space-y-3">
                    {/* Start Date */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={tempStartDate?.toISOString()?.split('T')[0]}
                          onChange={(e) => setTempStartDate(new Date(e.target.value))}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-3 text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
                        />
                      </div>
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={tempEndDate?.toISOString()?.split('T')[0]}
                          onChange={(e) => setTempEndDate(new Date(e.target.value))}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-3 text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clear Dates Button */}
                  <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-700/50">
                    <button
                      onClick={() => {
                        const today = new Date()
                        setTempStartDate(today)
                        setTempEndDate(today)
                      }}
                      className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline focus:outline-none transition-colors"
                    >
                      Reset to today
                    </button>
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleApply}
                  className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}