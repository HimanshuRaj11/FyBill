'use client'
import React, { useMemo } from 'react'
import { Button } from '../ui/button'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type Props = {
    data: any[];
    fileName: string;
};

export default function DownloadExcel({ data = [], fileName }: Props) {

    const transformers: Record<string, (data: any[]) => any[]> = {

        Invoices: (data) =>
            data.map((invoice) => {
                const productString = invoice.products
                    ?.map((p: any) =>
                        `${p.name} -- ${p.quantity} X ${p.rate} = ${p.amount}`
                    )
                    .join("; ");

                return {
                    "Invoice ID": invoice.invoiceId,
                    "Client Name": invoice.clientName,
                    "Branch Name": invoice.branchName,
                    "Payment Mode": invoice.paymentMode,
                    "Currency": invoice.currency,
                    "Issue Date": new Date(invoice.issueDate).toLocaleString(),
                    "Sub Total": invoice.subTotal,
                    "VAT Amount": invoice.totalTaxAmount,
                    "Exempted": invoice.isExempted ? "Yes" : "No",
                    "Grand Total": invoice.grandTotal,
                    "Products": productString,
                };
            }),

        Products: (data) =>
            data.map((product) => ({
                "ID": product._id,
                "Name": product.name,
                "Price": product.price,
                "Description": product.description,
                "Code": product.product_number,
                "Branch": product.branchId?.branchName,
            })),

        ProductsSummary: (data) =>
            data.map((product) => ({
                "Name": product.name,
                "Rate": product.rate,
                "Quantity": product.quantity,
                "Price": product.amount,
            })),

        Invoice_Kot_Data: (data) =>
            data.map((invoice) => ({
                "Invoice ID": invoice.invoiceId,
                "Client Name": invoice.clientName,
                "Branch Name": invoice.branchName,
                "Payment Mode": invoice.paymentMode,
                "Currency": invoice.currency,
                "Issue Date": new Date(invoice.issueDate).toLocaleString(),
                "Sub Total": invoice.subTotal,
                "VAT Amount": invoice.currency + invoice.totalTaxAmount,
                "Actual Grand Total": invoice.grandTotal,
                "last KOT Grand Total": invoice.LastKotGrandTotal,
                "Exempted": invoice.isExempted ? "Yes" : "No",
            })),
    };


    const dataToDownload = useMemo(() => {

        if (!data?.length) return [];

        // Exact match
        if (transformers[fileName]) {
            return transformers[fileName](data);
        }

        // StartsWith match (for ProductsSummary variants)
        if (fileName.startsWith("ProductsSummary")) {
            return transformers["ProductsSummary"](data);
        }

        return data;

    }, [data, fileName]);


    const handleDownload = () => {

        if (!dataToDownload.length) return;

        const worksheet = XLSX.utils.json_to_sheet(dataToDownload);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <Button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded"
        >
            Download as Excel
        </Button>
    );
}
