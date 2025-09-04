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

export interface privateTemplates {
  privateTemplates: template[];
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
    throw new Error(
      error.response?.data?.message || "Error fetching templates"
    );
  }
};


export const getUserTemplates = async (): Promise<privateTemplates> => {
  try {
    const response = await axiosInstance.get("/v1/api/templates/my-templates");
    return {
      privateTemplates: response.data,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching templates"
    );
  }
};

export const togglePublic = async (templateId: string) => {
  try {
    console.log("toggled pub: ", templateId);
    const response = await axiosInstance.patch(
      `/v1/api/templates/toggle-public/${templateId}`
    );
    return response.data;
  } catch (error: any) {
    return {
      message: error.response.data.message || "Error toggling template",
    };
  }
};

export const deleteTemplate = async (templateId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/v1/api/templates/delete/${templateId}`
    );
    return response.data;
  } catch (error: any) {
    return {
      message: error.response.data.message || "Error deleting template",
    };
  }
};

export const createTemplate = async (
  file: File,
  title: string
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", file); // matches @RequestPart("file")
    const isPublic: boolean = false;
    const response = await axiosInstance.post(
      `/v1/api/templates/create?isPublic=${isPublic}&title=${title}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error creating template");
  }
};
