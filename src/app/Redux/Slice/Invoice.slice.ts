import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios';
import { redirect } from "next/navigation";
const base_url = process.env.NEXT_PUBLIC_BASE_URL


export const FetchInvoicesList = createAsyncThunk("FetchInvoicesList", async ({ selectedBranch, startDate, endDate }: { selectedBranch: any, startDate: any, endDate: any }) => {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Invoice/filter`, { selectedBranch, startDate, endDate })
        return res.data
    } catch (error) {
        throw error;
    }
})

const InvoiceSlice = createSlice({
    name: "Invoices",
    initialState: {
        Invoices: null,
        dateRange: null,
        loading: false,
        error: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchInvoicesList.pending, (state) => {
                state.loading = true
            })
            .addCase(FetchInvoicesList.fulfilled, (state, action) => {
                state.loading = false;
                state.Invoices = action.payload.invoices;
                state.error = false
            })
            .addCase(FetchInvoicesList.rejected, (state) => {
                state.loading = false
                state.error = true
                state.Invoices = null
            })

    }
})

export default InvoiceSlice.reducer;