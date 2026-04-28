import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name:"company",
    initialState:{
        singleCompany:null,
        companies:[],
        searchCompanyByText:"",
        trashedCompanies: [], 
    },
    reducers:{
        //actions
        setSingleCompany:(state,action) => {
            state.singleCompany = action.payload;
        },
        setCompanies:(state,action) => {
            state.companies = action.payload;
        },
        setSearchCompanyByText:(state,action) => {
            state.searchCompanyByText = action.payload;
        },
          softDeleteCompanyReducer: (state, action) => {
            // Remove company from active companies (moved to trash)
            state.companies = state.companies.filter(
                (company) => company._id !== action.payload
            );
        },
        
        setTrashedCompanies: (state, action) => {
            state.trashedCompanies = action.payload;
        },
        restoreCompanyReducer: (state, action) => {
            // Remove company from trash
            state.trashedCompanies = state.trashedCompanies.filter(
                (company) => company._id !== action.payload
            );
        },
        permanentDeleteCompanyReducer: (state, action) => {
            // Remove company from trash permanently
            state.trashedCompanies = state.trashedCompanies.filter(
                (company) => company._id !== action.payload
            );
        }
    }
});
export const {setSingleCompany, setCompanies,setSearchCompanyByText, softDeleteCompanyReducer, setTrashedCompanies, restoreCompanyReducer, permanentDeleteCompanyReducer } = companySlice.actions;
export default companySlice.reducer;