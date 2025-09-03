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

export interface Template {
  id: string;
  uploaderId: string;
  uploadedAt: string;
  title: string;
  fileUrl: string;
  frequency: string;
  public: boolean;
}

export interface User {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUrl: string | null;
  createdAt: string;
  recentTemplates: Template[] | null;
  restricted: boolean;
}

export type TemplateTab = 'public' | 'private';