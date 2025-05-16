import {
  commentPost,
  createPost,
  createUserAccount,
  deletePost,
  deleteSavedPost,
  getAllUsers,
  getInfinitePosts,
  getPostById,
  getRecentPosts,
  getSaveUserPosts,
  getUserById,
  getUserPosts,
  likePost,
  savePost,
  searchPosts,
  signInAccount,
  signOutAccount,
  updateUserPassword,
  updatePost,
  updateProfile,
  likeComment,
} from "@/firebase/api";
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
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export function useGetUserPosts(userId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      user,
      isLiked,
    }: {
      postId: string;
      user: SetLike;
      isLiked: boolean;
    }) => likePost(postId, user, isLiked),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
        },
        data
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
    },
  });
};

export const useComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ comment }: { comment: ICommentUser }) =>
      commentPost(comment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
      userId,
      isLiked,
    }: {
      postId: string;
      commentId: string;
      userId: string;
      isLiked: boolean;
    }) => likeComment(postId, commentId, userId, isLiked),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
        },
        data
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (save: SavePost) =>
      savePost({
        userId: save.userId,
        creatorName: save.creatorName,
        creatorImage: save.creatorImage,
        postId: save.postId,
        postImageUrl: save.postImageUrl,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.postId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVE_USER_POSTS],
      });
    },
  });
};

export function useGetSaveUserPosts(userId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVE_USER_POSTS, userId],
    queryFn: () => getSaveUserPosts(userId),
    enabled: !!userId,
  });
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (save: { userId: string; saveRecordID: string }) =>
      deleteSavedPost(save.userId, save.saveRecordID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVE_USER_POSTS],
      });
    },
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    initialPageParam: undefined,
    queryFn: getInfinitePosts,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.length === 0) {
        return null;
      }

      const lastId = lastPage[lastPage.length - 1];
      return lastId.createdAt;
    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetAllUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getAllUsers(limit),
  });
};

export const useGetUserId = (userID: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userID],
    queryFn: () => getUserById(userID),
    enabled: !!userID,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: IUpdateProfile) => updateProfile(profile),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (Password: { newPassword: string; oldPassword: string }) =>
      updateUserPassword(Password),
  });
};
