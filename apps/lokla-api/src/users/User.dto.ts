export type RequestCreateUser = {
  fullName: string;
  email: string;
  password: string;
  role: string;
};

export type RequestUpdateUser = {
  fullName: string;
  email: string;
  oldEmail: string;
  password: string;
  role: string;
};

export type RequestDeleteUser = {
  email: string;
};
