import { INewPost, INewUser, IUpdatePost, IUpdateProfile } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, ImageGravity, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avaterUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountid: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      imageUrl: avaterUrl,
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountid: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountid", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = account.deleteSession("current");

    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    const upLoadedFile = await upLoadFile(post.file[0]);

    if (!upLoadedFile) throw Error;

    // Get file Url
    const fileUrl = getFilePreview(upLoadedFile.$id);

    if (!fileUrl) {
      await deleteFile(upLoadedFile.$id);
      throw Error;
    }

    // Convert tags in an arry
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Save post to database

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        imageUrl: fileUrl,
        caption: post.caption,
        location: post.location,
        imageId: upLoadedFile.$id,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(upLoadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function upLoadFile(file: File) {
  try {
    const upLoadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return upLoadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Center,
      100
    );

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatePost) throw Error;

    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatePost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatePost) throw Error;

    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRcordID: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      savedRcordID
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function UpdatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      const upLoadedFile = await upLoadFile(post.file[0]);

      if (!upLoadedFile) throw Error;

      // Get file Url
      const fileUrl = getFilePreview(upLoadedFile.$id);

      if (!fileUrl) {
        deleteFile(upLoadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: upLoadedFile.$id };
    }

    // Convert tags in an arry
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Save post to database

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        imageUrl: image.imageUrl,
        caption: post.caption,
        location: post.location,
        imageId: image.imageId,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: any, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUsers(limit?: number) {
  let query: any = null;

  if (limit) {
    query = [Query.orderDesc("$createdAt"), Query.limit(limit)];
  } else {
    query = [Query.orderDesc("$createdAt")];
  }

  try {
    const Users = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      query
    );

    if (!Users) throw Error;

    return Users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userID: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userID
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function UpdateProfile(profile: IUpdateProfile) {
  const hasUpdateImg = profile.file.length > 0;
  try {
    let image = {
      imageId: profile.imageId,
      imageUrl: profile.imageUrl,
    };

    if (hasUpdateImg) {
      const upLoadedFile = await upLoadFile(profile.file[0]);

      if (!upLoadedFile) throw Error;

      const getFile = getFilePreview(upLoadedFile.$id);
      if (!getFile) {
        await deleteFile(upLoadedFile.$id);
        throw Error;
      }

      image = { ...image, imageId: upLoadedFile.$id, imageUrl: getFile };
    }

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      profile.profileId,
      {
        name: profile.name,
        bio: profile.bio,
        imageId: image.imageId,
        imageUrl: image.imageUrl,
      }
    );

    if (!updatedUser) {
      if (hasUpdateImg) {
        await deleteFile(image.imageId);
      }
      throw Error;
    }

    // Safely delete old file after successful update
    if (profile.imageId && hasUpdateImg) {
      await deleteFile(profile.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function getRelatedPost(Relat: string) {
  try {
    const relatedPost = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("tags", Relat), Query.orderDesc("$createdAt")]
    );

    if (!relatedPost) throw Error;
    return relatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function UpdateEmail(email: string, password: string) {
  try {
    const UpdateEmail = await account.updateEmail(email, password);

    if (!UpdateEmail) throw Error;
    await signOutAccount();

    return UpdateEmail;
  } catch (error) {
    console.log(error);
  }
}

export async function UpdatePassword(Password: {
  newPassword: string;
  oldPassword: string;
}) {
  try {
    const result = await account.updatePassword(
      Password.newPassword,
      Password.oldPassword // oldPassword (optional)
    );
    if (!result) throw Error;

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function RecoveryPassword(email: string) {
  try {
    const result = await account.createRecovery(
      email, // email
      "http://localhost:5173/reset-password" // url
    );
    if (!result) throw Error;
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function ResetPasswordApi({
  userId,
  token,
  password,
}: {
  userId: string;
  token: string;
  password: string;
}) {
  try {
    const result = await account.updateRecovery(
      userId, // userId
      token, // secret
      password // password
    );
    if (!result) throw Error;

    return result;
  } catch (error) {
    console.log(error);
  }
}
