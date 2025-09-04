import axiosInstance from "@/Axios/axios";

export interface SignaturePosition {
  page: number;
  x: number;
  y: number;
}

export interface Recipient {
  userId: string;
  signed: boolean;
  signaturePositions: SignaturePosition[];
}

export interface CreateRequestData {
  title: string;
  templateId: string;
  emailSubject: string;
  emailMessage: string;
  recipients: Recipient[];
}

// Response types (adjust based on your actual API response)
export interface RequestInfo {
  requestId: string;
  title: string;
  templateId: string;
  status: string;
  createdAt: string;
}

export interface ErrorResponse {
  message: string;
}

export interface receivedRequest {
  id: string;
  senderId: string;
  title: string;
  status: string;
  recipients: Recipient[];
  emailSubject: string;
  emailMessage: string;
  templateId: string;
  pdfVersions: string;
  createdAt: string;
  updatedAt: string;
}

export interface allReceivedRequests {
  allRequests: receivedRequest[];
}
export interface sentRequests {
  sentRequests: receivedRequest[];
}

// The API call function
export const createRequest = async (
  requestData: CreateRequestData
): Promise<RequestInfo | ErrorResponse> => {
  try {
    const response = await axiosInstance.post(
      "/v1/api/requests/create",
      requestData
    );
    return {
      requestId: response.data.id || response.data.requestId,
      title: response.data.title,
      templateId: response.data.templateId,
      status: response.data.status,
      createdAt: response.data.createdAt,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Error creating new request",
    };
  }
};

export const getReceivedRequests = async (): Promise<allReceivedRequests> => {
  try {
    const response = await axiosInstance.get(
      "/v1/api/requests/received-requests"
    );
    return {
      allRequests: response.data,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const getSentRequests = async (): Promise<sentRequests> => {
  try {
    const response = await axiosInstance.get("/v1/api/requests/my-requests");
    return {
      sentRequests: response.data,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const getRequestById = async (
  requestId: string
): Promise<receivedRequest> => {
  try {
    const response = await axiosInstance.get(`/v1/api/requests/${requestId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

// Download template PDF
export const downloadTemplatePdf = async (templateId: string): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(
      `/v1/api/templates/download/${templateId}`,
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error downloading template");
  }
};

// Download request PDF version
export const downloadRequestPdf = async (requestId: string): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(
      `/v1/api/sign/download/${requestId}`,
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error downloading request PDF");
  }
};

// Sign document
export const signDocument = async (requestId: string, file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post(
      `/v1/api/sign/sign-by-user?requestId=${requestId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error signing document");
  }
};
