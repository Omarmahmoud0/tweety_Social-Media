import {
  deleteComment,
  listenToPostComments,
  updateComment,
} from "@/firebase/api";
import Comments from "@/components/shared/Comments";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
  useLikeComment,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked, multiFormatDateString } from "@/lib/utils";
import { ICommentUser } from "@/types";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Ellipsis } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isPending } = useGetPostById(id!);
  const [Post, setPost] = useState<any>(post);
  const { user } = useUserContext();
  const { mutate: deletePost } = useDeletePost();
  const [comments, setComments] = useState<any>([]);
  const [EditDev, setEditDev] = useState(false);
  const [idComment, setidComment] = useState<string | undefined>("");
  const { mutateAsync: likeComment } = useLikeComment();
  const [title, setTitle] = useState("");
  const [ShowTitleComment, setShowTitleComment] = useState(false);
  const [EditCommentId, setEditCommentId] = useState("");

  const { toast } = useToast();

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

  const handleLikeComment = (
    e: React.MouseEvent,
    comment: { commentId: string; likesArr: string[] }
  ) => {
    e.stopPropagation();
    if (post?.id) {
      const hasLiked = comment.likesArr?.some((IDs: any) => IDs === user.id);
      likeComment({
        postId: post.id,
        commentId: comment.commentId,
        userId: user.id,
        isLiked: hasLiked,
      });
    }
  };

  const handleUpdateComment = (title: string, commentId: string) => {
    setShowTitleComment(true);
    setTitle(title);
    setEditCommentId(commentId);
  };
  const handleSaveChangeComment = async (
    postId: string,
    commentId: string,
    title: string
  ) => {
    console.log(commentId);

    const update = await updateComment({
      commentId: commentId,
      postId: postId,
      title: title,
    });
    if (update) {
      toast({
        title: "Comment updated successfully",
      });
      setShowTitleComment(false);
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
                  <div
                    className="flex gap-2 relative"
                    // onMouseLeave={() => setEditDev(false)}
                    onMouseOver={() => {
                      setEditDev(true);
                      setidComment(comment.id);
                    }}
                  >
                    <img
                      src={comment?.imageUrl}
                      className="rounded-full object-cover w-10 h-10"
                      alt=""
                    />
                    <div className="flex flex-col gap-1 ">
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
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500">
                          {multiFormatDateString(Date())}
                        </p>
                        <div className="flex items-center gap-1">
                          <img
                            className="cursor-pointer"
                            src={
                              checkIsLiked(comment.likes!, user.id)
                                ? "/assets/icons/liked.svg"
                                : "/assets/icons/like.svg"
                            }
                            width={20}
                            height={20}
                            alt="like"
                            onClick={(e) => {
                              if (comment.id) {
                                handleLikeComment(e, {
                                  commentId: comment.id,
                                  likesArr: comment.likes!,
                                });
                              }
                            }}
                          />
                          {comment.likes?.length! > 0 && (
                            <span className="md:text-sm text-xs">
                              {comment.likes?.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {EditDev &&
                      idComment === comment.id &&
                      comment.userId === user.id && (
                        <div
                          className="absolute flex items-center justify-center top-1 right-1 hover:bg-gray-800 border
                          border-border-color w-10 rounded-xl"
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Ellipsis />{" "}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-52 bg-gray-900  rounded-md ">
                              <DropdownMenuItem
                                className="text-sm p-2 hover:border hover:border-border-color rounded-xl cursor-pointer"
                                onClick={() =>
                                  handleUpdateComment(
                                    comment.title,
                                    comment.id!
                                  )
                                }
                              >
                                Edit Comment
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-sm p-2 hover:border hover:border-border-color rounded-xl cursor-pointer"
                                onClick={async () => {
                                  if (post?.id && comment.id) {
                                    await deleteComment(post?.id, comment.id);
                                  }
                                }}
                              >
                                Delete Comment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}

                    {ShowTitleComment && EditCommentId && (
                      <div
                        className="fixed w-full top-[45%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
                        key={comment.id}
                      >
                        <div className="container mx-auto px-4 py-8 max-w-3xl bg-gray-900 rounded-lg shadow-2xl border-border-color border">
                          <Card className="w-full shadow-lg">
                            <CardHeader className="flex flex-col sm:flex-row items-center gap-4 p-6">
                              <div className="relative group">
                                <img
                                  className="rounded-full object-cover"
                                  src={
                                    user.imageUrl ||
                                    "/assets/icons/profile-placeholder.svg"
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="w-full">
                                <Label
                                  htmlFor="title"
                                  className="text-sm font-medium"
                                >
                                  Title
                                </Label>
                                <Input
                                  id="title"
                                  placeholder="Enter a title..."
                                  className="mt-1 text-black"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                />
                              </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                              {/* Content section removed */}
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 p-6 pt-0">
                              <Button
                                className="hover:bg-gray-700"
                                variant="outline"
                                onClick={() => setShowTitleComment(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-border-color"
                                onClick={() => {
                                  if (id) {
                                    handleSaveChangeComment(
                                      id,
                                      EditCommentId,
                                      title
                                    );
                                  }
                                }}
                              >
                                Submit
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </div>
                    )}
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
