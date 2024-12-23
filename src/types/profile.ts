import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  // id: string;
  // userId: string;
  // avatarUrl?: string;
  // displayName: string;
  // bio: string;
  // location: string;
  // skills: string[];
  // socialLinks: {
  //   github?: string;
  //   linkedin?: string;
  //   twitter?: string;
  //   portfolio?: string;
  // };
  // createdAt: Date | Timestamp;
  // updatedAt: Date | Timestamp;
  // hobbiesAndInterests: string[];
  // languages: string[];
  // emailAddress?: string;
  // phoneNumber: string;
  // points: number;
  // orderHistory: string[]; // Array of order IDs
  // likedProducts: string[]; // Array of product IDs
  id: string;
  userId: string;
  avatarUrl?: string;
  displayName: string;
  bio: string;
  location: string;
  skills: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
  };
  hobbiesAndInterests: string[];
  languages: string[];
  emailAddress: string;
  phoneNumber: string;
  points: number;
  orderHistory: any[];
  likedProducts: string[];
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Project {
  id: string;
  name: string;
  projectName: string;
  techStack: string;
  repoUrl: string;
  imageUrl?: string;
  approved: boolean;
  description: string;
  features: string[];
  stars: number;
  starredBy: string[];
  userId?: string;
  completionDate: Timestamp;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  projectDescription: string;
  requiredSkills: string[];
  maxMembers: number;
  currentMembers: string[];
  status: "open" | "closed";
  createdAt: Timestamp;
}

export interface TeamRequest {
  id: string;
  teamId: string;
  userId: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
}

export interface LikedProject {
  id: string;
  projectName: string;
  techStack: string;
  likes: number;
}

export interface CertificateProps {
  project: Project;
  profile: UserProfile;
}

export interface Certificate {
  id: string;
  projectName: string;
  issuedBy: string;
  issueDate: Date;
  verificationUrl: string;
}
