/**
 * TypeScript type definitions for the application.
 */

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TaskCategory {
  PERSONAL = "PERSONAL",
  WORK = "WORK",
  SHOPPING = "SHOPPING",
  HEALTH = "HEALTH",
  LEARNING = "LEARNING",
  PROJECT = "PROJECT",
  OTHER = "OTHER",
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  due_date: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TaskPriority;
  category?: TaskCategory;
  due_date?: string;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}
