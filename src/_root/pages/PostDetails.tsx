import Comments from "@/components/shared/Comments";
import GridPostsList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
  useGetRelatedPosts,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: post, isPending } = useGetPostById(id || "");
  const { user } = useUserContext();
  const { mutate: deletePost } = useDeletePost();

  const {
    data: RelatedPosts,
    isFetching: isRelatPostsLoading,
    isError,
  } = useGetRelatedPosts(post?.tags);

  const relatedPosts = RelatedPosts?.documents.filter(
    (posts) => posts.$id !== id
  );
  const checkRelatedPosts = relatedPosts && relatedPosts?.length > 0;

  const handleDeletePost = () => {
    // Delete post logic here
    deletePost({ postId: id, imageId: post?.imageUrl });
    navigate(-1);
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} className="post_details-img" alt="post" />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>

                  <div className="flex-center gap-2 text-light-3">
                    <p className="suble-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    -
                    <p className="suble-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
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
                    user.id !== post?.creator.$id && "hidden"
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
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <hr className="border-border-color w-full" />

            {post?.comments.length != 0 ? (
              <div className="flex flex-col gap-2 h-40 max-w-full overflow-hidden md:hover:overflow-y-scroll max-md:overflow-y-scroll custom-scrollbar ">
                {post?.comments.map((comment: Models.Document) => (
                  <div className="flex gap-2">
                    <img
                      src={comment.imageUrl}
                      className="rounded-full object-cover w-10 h-10"
                      alt=""
                    />
                    <div className="flex flex-col ">
                      <div className="flex gap-3">
                        <p className="flex break-all flex-col ">
                          <Link to={`/profile/${comment.userId}`}>
                            <span className="text-primary-600 min-w-max hover:border-b-2 border-primary-600">
                              {comment.name}
                            </span>
                          </Link>
                          {comment.comment}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {multiFormatDateString(comment.$createdAt)}
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
              <PostStats post={post} userId={user.id} />
              <Comments postId={id!} />
            </div>
          </div>
        </div>
      )}

      {checkRelatedPosts && (
        <div className="w-full max-w-5xl">
          <hr className="border w-full border-dark-4/80" />

          <h3 className="body-bold md:h3-bold w-full my-10">
            More Related Posts
          </h3>
          {isRelatPostsLoading || !RelatedPosts ? (
            <Loader />
          ) : isError ? (
            <p>Something went wrong</p>
          ) : (
            <GridPostsList posts={relatedPosts} showStats={false} />
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetails;
