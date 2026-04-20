import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // Import createAsyncThunk for API calls

// Create async thunk for fetching all jobs
export const getAllJobs = createAsyncThunk(
    'job/getAllJobs', // Action type prefix
    async () => {
        const response = await fetch('http://localhost:8000/api/v1/job');
        const data = await response.json();
        // Handle different response structures
        // If data has a 'jobs' property, return that, otherwise return data directly
        return data.jobs || data.data || data;
    }
);
const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        loading: false,  // Track API request status
        error: null,     // Store any error messages
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;

        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        }
    },
    // Handle the async thunk actions
    extraReducers: (builder) => {
        builder
            .addCase(getAllJobs.pending, (state) => {
                // When API call is in progress
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllJobs.fulfilled, (state, action) => {
                // When API call is successful
                state.loading = false;
                state.allJobs = action.payload; // Store fetched jobs
            })
            .addCase(getAllJobs.rejected, (state, action) => {
                // When API call fails
                state.loading = false;
                state.error = action.error.message; // Store error message
            });
    }
});
export const { setAllJobs, setSingleJob, setAllAdminJobs, setSearchJobByText, setAllAppliedJobs, setSearchedQuery } = jobSlice.actions;
export default jobSlice.reducer;