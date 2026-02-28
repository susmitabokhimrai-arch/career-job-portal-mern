import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authslice";
import jobSlice from "./jobSlice";
const store = configureStore({
    reducer: {
        auth: authSlice,
        job: jobSlice
    }
});
export default store;