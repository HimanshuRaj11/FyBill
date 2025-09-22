
import { configureStore } from "@reduxjs/toolkit";

import UserSlice from './Slice/User.slice'
import CompanySlice from './Slice/Company.slice';
import ProductSlice from './Slice/Products.slice';
import InvoiceSlice from './Slice/Invoice.slice';
export const store = configureStore({
    reducer: {
        User: UserSlice,
        Company: CompanySlice,
        Products: ProductSlice,
        Invoices: InvoiceSlice,
    },
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;