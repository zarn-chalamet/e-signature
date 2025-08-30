import axiosInstance from "@/Axios/axios";
import type { error, userInfo } from "./Auth";

export interface allUsers {
  allUsers: userInfo[];
}

export const getAllUsers = async (): Promise<allUsers> => {
  try {
    const response = await axiosInstance.get("/v1/api/users");
    return { allUsers: response.data };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching users");
  }
};
