export interface Institution {
  id: string;
  name: string;
  email: string;
  website: string;
  description: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Credential {
  id: string;
  userId: string;
  institutionId: string;
  type: string;
  issueDate: Date;
  expirationDate?: Date;
  metadata: Record<string, any>;
}
