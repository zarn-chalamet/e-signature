import axiosInstance from "@/Axios/axios";
import type { error, userInfo } from "./Auth";

export interface allUsers {
  allUsers: userInfo[];
}

interface userData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const getAllUsers = async (): Promise<allUsers> => {
  try {
    const response = await axiosInstance.get("/v1/api/users");
    return { allUsers: response.data };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching users");
  }
};

export const createUser = async (
  userData: userData
): Promise<userInfo | error> => {
  try {
    const response = await axiosInstance.post("/v1/api/users/create", userData);
    return {
      userId: response.data.id,
      role: response.data.role,
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      image: response.data.image,
      recentTemplates: response.data.recentTemplates,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message || "Error creating new user",
    };
  }
};
