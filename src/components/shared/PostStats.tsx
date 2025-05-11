import {
  useDeleteSavedPost,
  useGetSaveUserPosts,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";
import React, { useEffect, useState } from "react";
import { IUser } from "@/types";

type PostStatsProps = {
  post?: any;
  user: IUser;
  comments: number;
};

const PostStats = ({ post, user, comments }: PostStatsProps) => {
  const [isSaved, setIsSaved] = useState(new Set());
  const likesList = post?.likes?.map(
    (user: { userId: string; name: string; image: string }[]) => user
  );
  const { mutate: likePost, isPending } = useLikePost();
  const { data: savedPosts } = useGetSaveUserPosts(user.id);
  const { mutateAsync: savePost, isPending: isSavingPost } = useSavePost();
  const { mutateAsync: deleteSavedPost, isPending: isDeleteSaved } =
    useDeleteSavedPost();

  const isSavedPost = savedPosts?.find((save: any) => save.postId === post.id);

  useEffect(() => {
    if (savedPosts) {
      const save = savedPosts.map((save: any) => save.postId);
      setIsSaved(new Set([...save]));
    }
  }, [savedPosts]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    const hasLiked = post?.likes?.some((post: any) => post.userId === user.id);
    likePost({
      postId: post.id,
      user: { userId: user.id, name: user.name, imageUrl: user.imageUrl },
      isLiked: hasLiked,
    });
  };

  const checkHasSaved = (id: string) => {
    if (isSaved.has(id)) {
      setIsSaved((prev) => {
        const newLikes = new Set(prev);
        newLikes.delete(id);
        return newLikes;
      });
    } else {
      setIsSaved((prev) => {
        const newLikes = new Set(prev);
        newLikes.add(id);
        return newLikes;
      });
      return id;
    }
  };

  const handleSavePost = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const result = checkHasSaved(post.id);
    if (!isSaved.has(post.id) && result !== undefined) {
      await savePost({
        creatorName: post.creator.name,
        creatorImage: post.creator.image,
        postId: post?.id || "",
        userId: user.id,
        postImageUrl: post.imageUrl,
      });
    } else if (isSaved.has(post.id) && isSavedPost && result === undefined) {
      await deleteSavedPost({ userId: user.id, saveRecordID: isSavedPost.id });
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-3 mr-5">
        <div className="flex flex-center gap-1">
          {isPending ? (
            <Loader />
          ) : (
            <img
              src={
                checkIsLiked(likesList, user.id)
                  ? "/assets/icons/liked.svg"
                  : "/assets/icons/like.svg"
              }
              width={20}
              height={20}
              alt="like"
              onClick={handleLikePost}
              className="cursor-pointer"
            />
          )}
          <p className="small-medium lg:base-medium">
            {likesList?.length > 0 && likesList.length}
          </p>
        </div>
        <div className="flex flex-center gap-1">
          <img
            src={"/assets/icons/comments.svg"}
            width={25}
            height={25}
            alt="comments"
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">
            {comments > 0 && comments}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeleteSaved ? (
          <Loader />
        ) : (
          <img
            src={
              isSaved.has(post.id)
                ? "/assets/icons/saved.svg"
                : "/assets/icons/save.svg"
            }
            width={20}
            height={20}
            alt="save"
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
