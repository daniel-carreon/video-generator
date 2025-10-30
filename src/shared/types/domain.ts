/**
 * Domain Types
 * Define business logic types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}
