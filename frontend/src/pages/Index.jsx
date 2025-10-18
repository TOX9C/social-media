import Nav from "../comps/Nav";
import PostWall from "../comps/PostWall";
import SearchAndFollow from "../comps/SearchAndFollow";

const Index = () => {
  return (
    <>
      <div className="flex gap-8 w-screen bg-[#463f3a] h-screen">
        <Nav />
        <PostWall />
        <SearchAndFollow />
      </div>
    </>
  );
};
export default Index;
