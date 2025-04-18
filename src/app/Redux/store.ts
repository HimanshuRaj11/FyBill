
import { configureStore } from "@reduxjs/toolkit";

import UserSlice from './Slice/User.slice'
import CompanySlice from './Slice/Company.slice';
export const store = configureStore({
    reducer: {
        User: UserSlice,
        Company: CompanySlice
    },
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;