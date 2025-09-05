import axiosInstance from "@/Axios/axios";

interface loginData {
  email: string;
  password: string;
}

interface adminLoginData {
  email: string;
  adminCode: string;
  password: string;
}

export interface templateInfo {
  templateId: string;
  lastOpened: string;
}

export interface userInfo {
  userId: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  recentTemplates: templateInfo[];
  createdAt: string;
}

export interface error {
  message: string;
}

// services/authService.ts
export const login = async (credentials: loginData) => {
  try {
    const response = await axiosInstance.post(
      "/v1/api/auth/login",
      credentials
    );
    const { token } = response.data;
    if (token) {
      localStorage.setItem("authToken", token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// services/authService.ts
export const logout = async (): Promise<void> => {
  try {
    const response = await axiosInstance.post("/v1/api/auth/logout");

    localStorage.removeItem("authToken");

    delete axiosInstance.defaults.headers.common["Authorization"];
    window.location.href = "/auth";
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    localStorage.removeItem("authToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const getUserProfile = async (): Promise<userInfo | error> => {
  try {
    const response = await axiosInstance.get("/v1/api/users/profile");
    return {
      userId: response.data.id,
      role: response.data.role,
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      image: response.data.imageUrl,
      recentTemplates: response.data.recentTemplates,
      createdAt: response.data.createdAt
    };
  } catch (error: any) {
    return {
      message: error.response.data.message || "Error fetching profile",
    };
  }
};
