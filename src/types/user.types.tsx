export type UserList = UserType[];

export type UserType = {
  _id: string;
  user_name: string;
  email: string;
  role: string;
  permissions: Permission[];
  created_at: Date;
  updated_at: Date;
  __v: number;
};

export type Permission = {
  block?: boolean;
  view?: boolean;
};

export type UserForm = {
  user_name: string;
  email: string;
  role: string;
  permissions: {
    block?: boolean;
    view?: boolean;
  }[];
};

export type EditUserModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  userTableRowData: UserType;
  getUserList: (a: number, b: number) => void;
};

export type SignUpForm = {
  email: string;
  password: string;
  user_name: string;
  confirm_password?: string;
};

export type SigninForm = {
  email: string;
  password: string;
};
