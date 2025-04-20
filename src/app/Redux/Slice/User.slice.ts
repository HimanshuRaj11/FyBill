import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios';
import { redirect } from "next/navigation";
const base_url = process.env.NEXT_PUBLIC_BASE_URL


export const LogoutUser = createAsyncThunk("logoutUser", async () => {
    try {
        const res = await axios.get(`${base_url}/api/v1/logout`, { withCredentials: true })
        return res.data
    } catch (error) {
        return error
    }
})
export const FetchUser = createAsyncThunk("fetchUser", async () => {
    try {
        const res = await axios.get(`${base_url}/api/v1`, { withCredentials: true })
        return res.data
    } catch (error) {
        throw error;
    }
})

const UserSlice = createSlice({
    name: "User",
    initialState: {
        User: null,
        loading: false,
        error: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchUser.pending, (state) => {
                state.loading = true
            })
            .addCase(FetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.User = action.payload.user;
                state.error = false
            })
            .addCase(FetchUser.rejected, (state) => {
                state.loading = false
                state.error = true
                state.User = null
            })
            .addCase(LogoutUser.pending, (state) => {
                state.loading = true
            })
            .addCase(LogoutUser.fulfilled, (state) => {
                state.loading = false
                state.User = null
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.loading = false

            })
    }
})

export default UserSlice.reducer;