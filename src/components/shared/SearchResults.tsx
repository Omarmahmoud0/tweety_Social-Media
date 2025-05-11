import Loader from "./Loader";
import GridPostsList from "./GridPostsList";

type SearchResults = {
  searchPosts: { id: string }[] | undefined;
  isSearchFetching: boolean;
};

const SearchResults = ({ isSearchFetching, searchPosts }: SearchResults) => {
  if (isSearchFetching) return <Loader />;

  if (searchPosts && searchPosts.length > 0) {
    return <GridPostsList posts={searchPosts} dataType="posts" />;
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchResults;
