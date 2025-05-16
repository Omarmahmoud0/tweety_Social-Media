export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  creator: {
    name: string;
    imageUrl: string;
  };
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IUpdateProfile = {
  profileId: string;
  name: string;
  bio: string;
  imageUrl: URL;
  file: File[];
};

export type ICommentUser = {
  id?: string;
  name: string;
  imageUrl: string;
  userId: string;
  title: string;
  postId: string;
  likes?: string[];
};

export interface SavePost {
  creatorName: string;
  creatorImage: URL | string;
  postId: string;
  postImageUrl: URL | string;
  userId: string;
}

export type SetLike = Pick<ICommentUser, "userId" | "imageUrl" | "name">;
