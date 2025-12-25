
import React, { use } from 'react'
import CompanyProfile from './CompanyProfile';

export default function Page({ params }: { params: Promise<{ CompanyId: string }> }) {
    const CompanyId = use(params).CompanyId;
    return (
        <div>

            <CompanyProfile CompanyId={CompanyId} />

        </div>
    )
}
