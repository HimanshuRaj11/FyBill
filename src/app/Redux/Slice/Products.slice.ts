import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios';
import { redirect } from "next/navigation";
const base_url = process.env.NEXT_PUBLIC_BASE_URL


export const FetchProductsList = createAsyncThunk("FetchProductsList", async () => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`, { withCredentials: true })
        return res.data
    } catch (error) {
        throw error;
    }
})

const ProductSlice = createSlice({
    name: "Products",
    initialState: {
        Products: null,
        loading: false,
        error: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchProductsList.pending, (state) => {
                state.loading = true
            })
            .addCase(FetchProductsList.fulfilled, (state, action) => {
                state.loading = false;
                state.Products = action.payload.products;
                state.error = false
            })
            .addCase(FetchProductsList.rejected, (state) => {
                state.loading = false
                state.error = true
                state.Products = null
            })

    }
})

export default ProductSlice.reducer;