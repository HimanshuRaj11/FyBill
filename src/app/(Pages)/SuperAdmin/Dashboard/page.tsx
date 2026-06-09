'use client'
import React from 'react';
import { Building2, Users, FileText, DollarSign } from 'lucide-react';
import StatCard from '@/Components/SuperAdmin/StatCard';
import RevenueChart from '@/Components/SuperAdmin/RevenueChart';
import Dashboard from '@/Components/Main/Dashboard';

export default function SuperAdminDashboard() {
    return (
        <div className="space-y-6">
            <Dashboard />
        </div>
    );
}
