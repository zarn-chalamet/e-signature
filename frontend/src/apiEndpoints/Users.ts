import axiosInstance from "@/Axios/axios";
import type { error, templateInfo, userInfo } from "./Auth";

export interface allUsersInfo {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUrl: string | null;
  createdAt: string;
  recentTemplates: templateInfo[] | null;
  restricted: boolean;
}

export interface allUsers {
  allUsers: allUsersInfo[];
}

interface userData {
  role: string;
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
      createdAt: response.data.createdAt
    };
  } catch (error: any) {
    return {
      message: error.response.data.message || "Error creating new user",
    };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/v1/api/users/delete/${userId}`
    );
    return response.data;
  } catch (error: any) {
    return {
      message: error.response.data.message || "Error deleting user",
    };
  }
};

export const toggleRestrict = async (userId: string) => {
      try {
    const response = await axiosInstance.patch(
      `/v1/api/users/${userId}/toggle-restrict`
    );
    return response.data;
  } catch (error: any) {
    return {
      message: error.response.data.message || "Error restricting user",
    };
  }
}
