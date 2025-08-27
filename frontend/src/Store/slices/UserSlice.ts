import type { userInfo } from "@/apiEndpoints/Auth";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: userInfo = {
    userId: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    image: "",
    recentTemplates: []
}

const UserSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state: any, action: PayloadAction<userInfo>) => {
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.image = action.payload.image;
      state.recentTemplates = action.payload.recentTemplates;
    },
  },
});

export const { setUser } = UserSlice.actions;
export default UserSlice.reducer;