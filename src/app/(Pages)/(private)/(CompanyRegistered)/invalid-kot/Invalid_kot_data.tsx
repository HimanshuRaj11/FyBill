
'use client'
import axios from 'axios'
import React, { Suspense, useEffect, useState } from 'react'
import InvoiceList from './InvoiceList'
import InvoiceTableSkeleton from '@/Components/Skeleton/InvoiceTableSkeleton'

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


  return (
    <div>
      <InvoiceList Invoices={invalidKOTs} />
    </div>
  )
}
