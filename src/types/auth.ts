export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordErrors {
  length: boolean;
  number: boolean;
  uppercase: boolean;
  special: boolean;
}

export type UserRole = 'creator' | 'member';

export interface UserProfile {
  id: string;
  role: UserRole;
  username: string;
  // Add other profile fields as needed
} 