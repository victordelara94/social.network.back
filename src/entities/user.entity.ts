import { ImgData } from '../types/types';

export type Login = {
  userName: string;
  password: string;
};

export type User = Login & {
  id: string;
  email: string;
  following: User[];
  followers: User[];
  image: ImgData;
  isPrivate: boolean;
};
