export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  bio: string;
  skills: string[];
  socialLinks: SocialLinks;
  avatarUrl?: string;
}

export interface TeamProject {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  maxMembers: number;
  currentMembers: string[];
  status: "open" | "closed";
  createdAt: Date;
}

export interface TeamApplication {
  id: string;
  projectId: string;
  userId: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  requirements?: string[];
  applicationLink?: string;
  source: string;
  saved?: boolean;
}
