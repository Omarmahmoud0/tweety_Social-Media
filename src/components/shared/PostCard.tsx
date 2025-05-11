import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import Comments from "./Comments";
import { useEffect, useState } from "react";
import { listenToPostComments } from "@/firebase/api";

type PostCardProps = {
  post: any;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const [comments, setComments] = useState<any[]>([]);
  useEffect(() => {
    if (post.id) {
      const unsubscribe = listenToPostComments(post.id, setComments);
      return () => unsubscribe();
    }
  }, [post.id]);
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.id}`}>
            <img
              src={
                post?.creator.image || "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>

            <div className="flex-center gap-2 text-light-3">
              <p className="suble-semibold lg:small-regular">
                {multiFormatDateString(post.createdAt)}
              </p>
              -
              <p className="suble-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.id}`}
          className={`${user.id !== post.creator.id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" width={20} height={20} alt="Edit" />
        </Link>
      </div>

      <Link to={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          className="post-card_img"
          alt="post image"
        />
      </Link>

      <PostStats post={post} user={user} comments={comments.length} />
      <Comments postId={post?.id} user={user} key={post?.id} />
    </div>
  );
};

export default PostCard;
