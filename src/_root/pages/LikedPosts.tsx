import GridPostsList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";

const LikedPosts = () => {
  const { data: posts, isFetching } = useGetRecentPosts();
  const { user } = useUserContext();

  const LikedPosts = posts?.filter((post: any) =>
    post.likes?.some((like: any) => like.userId === user.id)
  );

  if (isFetching) {
    return <Loader />;
  }

  return (
    <div>
      {LikedPosts?.length === 0 ? (
        <p>Not liked posts here</p>
      ) : (
        <GridPostsList posts={LikedPosts} showStats={false} dataType="posts" />
      )}
    </div>
  );
};

export default LikedPosts;
