export interface SendVerificationEmailRequest {
  token: string;
  userId: string;
}

export interface ResendVerificationEmailRequest {
  userId: string;
}
