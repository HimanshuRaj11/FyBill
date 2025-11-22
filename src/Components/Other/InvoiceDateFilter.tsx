'use client'
import React, { useState } from 'react'
import { useGlobalContext } from '@/context/contextProvider'
import { Calendar, ChevronDown, Filter } from 'lucide-react';
import moment from 'moment';



export default function InvoiceDateFilter() {
  const {
    dateRange,
    setDateRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useGlobalContext();

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState(dateRange)
  const [tempStartDate, setTempStartDate] = useState(startDate)
  const [tempEndDate, setTempEndDate] = useState(endDate)


  const HandleDateRangeChange = (range: string) => {
    setTempDateRange(range);
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
    setDateRange(tempDateRange);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setIsFilterOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="px-4 py-2.5 border-2 border-gray-200 bg-white rounded-xl text-sm font-medium text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filter by Date</span>
        <span className="sm:hidden">Filter</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
      </button>

      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">
              {/* Date Range Selector */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  Select Date Range
                </label>
                <select
                  value={tempDateRange}
                  onChange={(e) => { HandleDateRangeChange(e.target.value) }}
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
              {tempDateRange === 'Custom' && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    Custom Date Range
                  </h4>

                  {/* Date Range Inputs */}
                  <div className="space-y-3">
                    {/* Start Date */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={tempStartDate?.toISOString()?.split('T')[0]}
                          onChange={(e) => setTempStartDate(new Date(e.target.value))}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full border-2 border-gray-200 bg-white rounded-lg p-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={tempEndDate?.toISOString()?.split('T')[0]}
                          onChange={(e) => setTempEndDate(new Date(e.target.value))}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full border-2 border-gray-200 bg-white rounded-lg p-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clear Dates Button */}
                  <div className="mt-4 pt-3 border-t border-blue-200">
                    <button
                      onClick={() => {
                        const today = new Date();
                        setTempStartDate(today);
                        setTempEndDate(today);
                      }}
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline focus:outline-none transition-colors"
                    >
                      Reset to today
                    </button>
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={handleApply}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}