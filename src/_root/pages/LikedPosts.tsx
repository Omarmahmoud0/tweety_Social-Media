import GridPostsList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser) {
    return <Loader />;
  }

  return (
    <div>
      {currentUser.liked.length === 0 ? (
        <p>Not liked posts here</p>
      ) : (
        <GridPostsList posts={currentUser.liked} showStats={false} />
      )}
    </div>
  );
};

export default LikedPosts;
