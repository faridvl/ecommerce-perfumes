export interface User {
  id: string;
  name: string;
  fullName: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userName: string;
}

export interface UserSessionResponse {
  user: User;
  tenant?: {
    id: string;
    name: string;
    businessName: string;
  };
}
