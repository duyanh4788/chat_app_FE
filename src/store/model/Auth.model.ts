export interface SignUpModel {
  account: string;
  passWord: string;
  fullName: string;
  email: string;
}

export interface SignInModel {
  account: string;
  passWord: string;
}

export interface UpdateUser {
  fullName: string;
  avatar: string;
  _id: string;
  type2FA: string;
  twoFA: boolean;
}
