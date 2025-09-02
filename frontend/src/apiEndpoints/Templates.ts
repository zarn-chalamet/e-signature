import axiosInstance from "@/Axios/axios";

export interface template {
  id: string;
  uploaderId: string;
  uploadedAt: string;
  title: string;
  fileUrl: string;
  frequency: string;
  public: boolean;
}

export interface publicTemplates {
  publicTemplates: template[];
}

export const getPublicTemplates = async (): Promise<publicTemplates> => {
  try {
    const response = await axiosInstance.get(
      "/v1/api/templates/public-templates"
    );
    return {
      publicTemplates: response.data,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching templates");
  }
};
