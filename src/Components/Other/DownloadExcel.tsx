'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadExcel({ data, fileName }: { data: any, fileName: string }) {

    const [dataToDownload, setDataToDownload] = useState([])

    const handleInvoice = useCallback(() => {
        const DownloadData = data.map((invoice: any) => {
            const productString = invoice.products
                .map((p: any) => `${p.name} -- ${p.quantity} X ${p.rate} = ${p.amount}`)
                .join("; ");

            return {
                "Invoice ID": invoice.invoiceId,
                "Client Name": invoice.clientName,
                "Branch Name": invoice.branchName,
                "Payment Mode": invoice.paymentMode,
                "Currency": invoice.currency,
                "Issue Date": new Date(invoice.issueDate).toLocaleString(),
                "Grand Total": invoice.grandTotal,
                Products: productString,
            };
        });
        setDataToDownload(DownloadData)
    }, [data, fileName])

    const handleProduct = useCallback(() => {
        const DownloadData = data.map((product: any) => {
            return {
                "ID": product._id,
                "Name": product.name,
                "price": product.price,
                "Description": product.description,
                "Code": product.product_number,
                "Branch": product.branchId?.branchName
            }
        })
        setDataToDownload(DownloadData)
    }, [data, fileName])


    const handleProductSummary = useCallback(() => {
        const DownloadData = data.map((product: any) => {
            return {
                "Name": product.name,
                "Rate": product.rate,
                "Quantity": product.quantity,
                "price": product.amount,
            }
        })
        setDataToDownload(DownloadData)
    }, [data, fileName])


    const handleDownload = () => {

        const worksheet = XLSX.utils.json_to_sheet(dataToDownload);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `${fileName}`);

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(blob, `${fileName}.xlsx`);
    };

    useEffect(() => {
        if (fileName == 'Invoices') {
            handleInvoice()
        }
        if (fileName == 'Products') {
            handleProduct()
        }
        if (fileName.startsWith('ProductsSummary')) {
            handleProductSummary()
        }

    }, [handleInvoice, handleProduct, handleProductSummary, fileName])

    return (
        <Button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded">
            Download as Excel
        </Button>
    )
}
