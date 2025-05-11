import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: { id: string }[] | undefined;
  showUser?: boolean;
  showStats?: boolean;
  dataType: string;
};

const GridPostsList = ({
  posts,
  dataType,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  return (
    <div className="grid-container">
      {posts?.map((post: any) => (
        <li key={post.id} className="relative min-w-80 h-80">
          <Link
            to={`/posts/${dataType === "posts" ? post.id : post.postId}`}
            className="grid-post_link"
          >
            <img
              src={dataType === "posts" ? post.imageUrl : post.postImageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    dataType === "posts"
                      ? post.creator.image
                      : post.creatorImage
                  }
                  alt="creator"
                  className="h-8 w-8 rounded-full"
                />
                <p className="line-clamp-1">
                  {dataType === "posts" ? post.creator.name : post.creatorName}
                </p>
              </div>
            )}

            {/* {showStats && <PostStats post={post} userId={user.id} />} */}
          </div>
        </li>
      ))}
    </div>
  );
};

export default GridPostsList;
