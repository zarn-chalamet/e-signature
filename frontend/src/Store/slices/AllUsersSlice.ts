import type { allUsers, allUsersInfo } from "@/apiEndpoints/Users";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    allUsers: [],
}

const AllUsersSlice = createSlice({
    name: 'allUsers',
    initialState: initialState,
    reducers: {
        setAllUsers:(state: any, action: PayloadAction<allUsersInfo[]>) =>{
            state.allUsers = action.payload;
        }
    }
});

export const { setAllUsers } = AllUsersSlice.actions;
export default AllUsersSlice.reducer;