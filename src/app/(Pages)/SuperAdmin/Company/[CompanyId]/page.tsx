'use client'
import axios from 'axios';
import React, { use, useState } from 'react'
import CompanyProfile from './CompanyProfile';

export default function Page({ params }: { params: Promise<{ CompanyId: string }> }) {
    const CompanyId = use(params).CompanyId;

    const [company, setCompany] = useState(null);

    const FetchCompanyData = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/SuperAdmin/Company/${CompanyId}`,
                { withCredentials: true }
            );
            if (data.success) {
                setCompany(data.company);
            }
        } catch (error) {
            console.log(error);
        }
    }
    if (!company) {
        FetchCompanyData();
    }
    return (
        <div>
            {company &&
                <CompanyProfile companyData={company} />
            }
        </div>
    )
}
