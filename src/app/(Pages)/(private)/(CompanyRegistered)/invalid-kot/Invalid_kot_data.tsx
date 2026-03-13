
'use client'
import axios from 'axios'
import React, { Suspense, useEffect, useState } from 'react'
import InvoiceList from './InvoiceList'
import InvoiceTableSkeleton from '@/Components/Skeleton/InvoiceTableSkeleton'
import DownloadExcel from '@/Components/Other/DownloadExcel'

export default function Invalid_kot_data() {

  const [invalidKOTs, setInvalidKOTs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const fetchInvalidKOTs = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/v1/Invoice/Invoice-with-error-kot`)
      if (data.success) {
        setInvalidKOTs(data.invoices)
      }
    } catch (error) {
      console.error("Error fetching invalid KOTs:", error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchInvalidKOTs()
  }, [])


  if (loading) {
    return <InvoiceTableSkeleton />
  }


  const Invoice_kot_Download = invalidKOTs?.map((invoice) => ({
    invoiceId: invoice.invoiceId,
    clientName: invoice.clientName,
    branchName: invoice.branchName,
    paymentMode: invoice.paymentMode,
    currency: invoice.currency,
    issueDate: new Date(invoice.issueDate).toLocaleString(),
    subTotal: invoice.subTotal,
    totalTaxAmount: invoice.totalTaxAmount,
    grandTotal: invoice.grandTotal,
    LastKotGrandTotal: invoice.kots[invoice.kots.length - 1]?.grandTotal || "N/A",
    isExempted: invoice.isExempted,
  }));



  return (
    <div>
      <DownloadExcel data={Invoice_kot_Download} fileName={"Invoice_KOT_Data"} />
      <InvoiceList Invoices={invalidKOTs} />
    </div>
  )
}
