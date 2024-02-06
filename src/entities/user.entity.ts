export type Login = {
  userName: string;
  password: string;
};

export type User = Login & {
  id: string;
  email: string;
  age: number;
  following: User[];
  followers: User[];
  avatar: String;
  isPrivate: boolean;
};
