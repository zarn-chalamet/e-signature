import type { allUsers } from "@/apiEndpoints/Users";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: allUsers = {
    allUsers: [],
}

const AllUsersSlice = createSlice({
    name: 'allUsers',
    initialState: initialState,
    reducers: {
        setAllUsers:(state: any, action: PayloadAction<allUsers>) =>{
            state.allUsers = action.payload.allUsers;
        }
    }
});

export const { setAllUsers } = AllUsersSlice.actions;
export default AllUsersSlice.reducer;