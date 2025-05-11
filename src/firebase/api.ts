import {
  ICommentUser,
  INewPost,
  INewUser,
  IUpdatePost,
  IUpdateProfile,
  SavePost,
  SetLike,
} from "@/types";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { SetStateAction } from "react";

export async function createUserAccount(user: INewUser) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    user.email,
    user.password
  );
  const newUser = userCredential.user;

  const userDoc = {
    id: newUser.uid,
    email: newUser.email,
    name: user.name,
    username: user.username,
    imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name
    )}&background=random`,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", newUser.uid), userDoc);
  return userDoc;
}

export async function signInAccount(user: { email: string; password: string }) {
  const session = await signInWithEmailAndPassword(
    auth,
    user.email,
    user.password
  );
  return session.user;
}

// Sign out user
export async function signOutAccount() {
  await signOut(auth);
  window.location.reload();
}

export async function uploadImageToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
}

export async function createPost(post: INewPost) {
  const imageUrl = await uploadImageToCloudinary(post.file[0]);
  const tags = post.tags?.replace(/ /g, "").split(",") || [];

  const postDoc = {
    creator: {
      name: post.creator.name,
      id: post.userId,
      image: post.creator.imageUrl,
    },
    imageUrl: imageUrl,
    caption: post.caption,
    location: post.location,
    tags: tags,
    likes: [],
    comments: [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "posts"), postDoc);
  return { id: docRef.id, ...postDoc };
}

export async function getRecentPosts() {
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getPostById(postId: string) {
  try {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPosts(userId: string) {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      where("creator.id", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(postsQuery);
    if (snapshot.empty) throw Error("No posts found");
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(
  postId: string,
  user: SetLike,
  isLiked: boolean
) {
  if (!postId || !user) return;
  try {
    const postRef = doc(db, "posts", postId);

    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(user),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user),
      });
    }

    // ✅ نرجع الداتا بعد التحديث
    const updatedSnap = await getDoc(postRef);
    return {
      id: postId,
      ...updatedSnap.data(),
    };
  } catch (error) {
    console.log(error);
  }
}

export async function commentPost(comment: ICommentUser) {
  try {
    const commentDoc = {
      name: comment.name,
      title: comment.title,
      imageUrl: comment.imageUrl,
      userId: comment.userId,
      createdAt: serverTimestamp(),
    };

    const commentsRef = collection(db, "posts", comment.postId, "comments");
    const docRef = await addDoc(commentsRef, commentDoc);

    return { id: docRef.id, ...commentDoc };
  } catch (error) {
    console.log(error);
  }
}

export function listenToPostComments(
  postId: string,
  callback: (comments: SetStateAction<any[]>) => void
) {
  const commentsRef = collection(db, "posts", postId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(comments);
  });

  return unsubscribe; // لما تخلص لازم تستخدم ده عشان تفصل ال listener
}

export async function savePost(save: SavePost) {
  try {
    const saveDoc = {
      creatorName: save.creatorName,
      creatorImage: save.creatorImage,
      postId: save.postId,
      postImageUrl: save.postImageUrl,
      createdAt: serverTimestamp(),
    };

    const savesRef = collection(db, "users", save.userId, "savedPosts");
    await addDoc(savesRef, saveDoc);
    return { id: save.postId, ...saveDoc };
  } catch (error) {
    console.log(error);
  }
}

export async function getSaveUserPosts(userId: string) {
  try {
    const savedPostsRef = collection(db, "users", userId, "savedPosts");

    const snap = await getDocs(savedPostsRef);
    const savedPosts = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return savedPosts;
  } catch (error) {
    console.log(error);
  }
}



export async function deleteSavedPost(userId: string, savedRcordID: string) {
  try {
    const postRef = doc(db, "users", userId, "savedPosts", savedRcordID);
    await deleteDoc(postRef);
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  try {
    const postRef = doc(db, "posts", post.postId);
    let updatedData: any = {
      caption: post.caption,
      location: post.location,
      tags: post.tags?.replace(/ /g, "").split(",") || [],
    };

    if (post.file.length > 0) {
      const newImageUrl = await uploadImageToCloudinary(post.file[0]);
      updatedData.imageUrl = newImageUrl;
    }

    await updateDoc(postRef, updatedData);
    return { id: postRef.id };
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string) {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam?: any }) {
  const baseQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(9)
  );
  const postsQuery = pageParam
    ? query(baseQuery, startAfter(pageParam))
    : baseQuery;

  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function searchPosts(searchTerm: string) {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const snapshot = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((post: any) =>
        post.caption.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return snapshot;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUsers(limitCount?: number) {
  const usersQuery = limitCount
    ? query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      )
    : query(collection(db, "users"), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(usersQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getUserById(userId: string) {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);
  return { id: snapshot.id, ...snapshot.data() };
}

export async function updateProfile(profile: IUpdateProfile) {
  try {
    const userRef = doc(db, "users", profile.profileId);
    let updatedData: any = {
      name: profile.name,
      bio: profile.bio,
    };

    if (profile.file.length > 0) {
      const newImageUrl = await uploadImageToCloudinary(profile.file[0]);
      updatedData.imageUrl = newImageUrl;
    }

    await updateDoc(userRef, updatedData);
    return { id: userRef.id };
  } catch (error) {
    console.log("Error updating profile:", error);
  }
}

export async function updateUserPassword({
  newPassword,
  oldPassword,
}: {
  newPassword: string;
  oldPassword: string;
}) {
  try {
    const newPass = await signInWithEmailAndPassword(
      auth,
      auth.currentUser!.email!,
      oldPassword
    );
    await updatePassword(auth.currentUser!, newPassword);
    return newPass.user.uid;
  } catch (error) {
    console.log(error);
  }
}

export async function recoveryPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { email };
  } catch (error) {
    console.log(error);
  }
}
