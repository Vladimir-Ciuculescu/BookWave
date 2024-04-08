export interface SendVerificationEmailRequest {
  token: string;
  userId: string;
}

export interface ResendVerificationEmailRequest {
  userId: string;
}

export interface LogOutRequest {
  fromAll: "yes" | "no";
}

export interface ChangePasswordRequest {
  email: string;
  password: string;
}
