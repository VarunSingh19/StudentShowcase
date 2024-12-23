import { Timestamp } from "firebase/firestore";

export interface Project {
  id: string;
  userId: string;
  name: string;
  projectName: string;
  techStack: string;
  description: string;
  features: string[];
  repoUrl: string;
  imageUrl: string;
  likes: number;
  approved: boolean;
  createdAt: Date | Timestamp;
  branch: string;
  projectType: string;
}
