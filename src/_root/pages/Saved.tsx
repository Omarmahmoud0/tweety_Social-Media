import GridPostsList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetSaveUserPosts } from "@/lib/react-query/queriesAndMutations";

const Saved = () => {
  const { user } = useUserContext();
  const { data: savedPosts, isFetching } = useGetSaveUserPosts(user.id);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {isFetching ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savedPosts?.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostsList
              posts={savedPosts}
              dataType="savedPost"
              showStats={false}
            />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
