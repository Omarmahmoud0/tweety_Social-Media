import { listenToPostComments } from "@/firebase/api";
import Comments from "@/components/shared/Comments";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { ICommentUser } from "@/types";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isPending } = useGetPostById(id!);
  const [Post, setPost] = useState<any>(post);
  const { user } = useUserContext();
  const { mutate: deletePost } = useDeletePost();
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (post) {
      setPost(post);
    }
  }, [post]);

  useEffect(() => {
    if (id) {
      const unsubscribe = listenToPostComments(id, setComments);
      return () => unsubscribe();
    }
  }, [id]);

  const handleDeletePost = () => {
    if (id) {
      deletePost({ postId: id });
      navigate(-1);
    }
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={Post?.imageUrl} className="post_details-img" alt="post" />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${Post?.creator.id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    Post?.creator.image ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12 object-cover"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {Post?.creator.name}
                  </p>

                  <div className="flex-center gap-2 text-light-3">
                    <p className="suble-semibold lg:small-regular">
                      {multiFormatDateString(Post?.createdAt)}
                    </p>
                    -
                    <p className="suble-semibold lg:small-regular">
                      {Post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center">
                <Link
                  to={`/update-post/${Post?.id}`}
                  className={`${user.id !== Post?.creator.id && "hidden"}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  className={`ghost_details-delete_btn ${
                    user.id !== Post?.creator.id && "hidden"
                  }`}
                  variant="ghost"
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{Post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {Post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <hr className="border-border-color w-full" />

            {comments?.length !== 0 ? (
              <div className="flex flex-col gap-2 h-40 w-full overflow-hidden md:hover:overflow-y-scroll max-md:overflow-y-scroll custom-scrollbar ">
                {comments?.map((comment: ICommentUser) => (
                  <div className="flex gap-2">
                    <img
                      src={comment?.imageUrl}
                      className="rounded-full object-cover w-10 h-10"
                      alt=""
                    />
                    <div className="flex flex-col ">
                      <div className="flex gap-3">
                        <p className="flex break-all flex-col ">
                          <Link to={`/profile/${comment?.userId}`}>
                            <span className="text-primary-600 min-w-max hover:border-b-2 border-primary-600">
                              {comment.name}
                            </span>
                          </Link>
                          {comment?.title}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {multiFormatDateString(Date())}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-center h-full w-full">
                <p className="text-slate-600">No comments yet</p>
              </div>
            )}

            <div className="w-full">
              <PostStats post={post} comments={comments.length} user={user} />
              <Comments postId={id!} user={user} key={id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
