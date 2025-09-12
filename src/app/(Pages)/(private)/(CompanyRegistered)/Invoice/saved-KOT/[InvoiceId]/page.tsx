import SavedKOTs from "@/Components/Main/SavedKots";
import React from "react";


export default function Page({ params }: { params: Promise<{ InvoiceId: string }> }) {
    const { InvoiceId } = React.use(params);


    return (
        <div>
            <SavedKOTs InvoiceId={InvoiceId} />
        </div>
    )
}
