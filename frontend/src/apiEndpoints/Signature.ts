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

// The API call function
export const createRequest = async (
  requestData: CreateRequestData
): Promise<RequestInfo | ErrorResponse> => {
  try {
    const response = await axiosInstance.post("/v1/api/requests/create", requestData);
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