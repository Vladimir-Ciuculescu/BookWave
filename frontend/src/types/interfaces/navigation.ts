import { UserProfile } from "./users";

export type StackNavigatorProps = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { userInfo: any };

  Settings: { profile: UserProfile };
  App: undefined;
  InitialScreen: undefined;
};
