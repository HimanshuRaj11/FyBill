
import UserSlice from './Slice/User.slice'
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        User: UserSlice
    },
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;