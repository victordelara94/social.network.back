export type Login = {
  userName: string;
  password: string;
};

export type User = Login & {
  id: string;
  email: string;
  firstName: string;
  surname: string;
  age: number;
  following: User[];
  followers: User[];
  avatar: String;
  // Posts: Post[];
};
