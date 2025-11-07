import Nav from "../comps/Nav";
import PostWall from "../comps/PostWall";
import SearchAndFollow from "../comps/SearchAndFollow";

const Index = () => {
  return (
    <>
      <div className="flex gap-0 md:gap-8 w-screen bg-[#463f3a] h-screen pb-16 md:pb-0">
        <Nav />
        <PostWall />
        <div className="hidden md:block">
          <SearchAndFollow />
        </div>
      </div>
    </>
  );
};
export default Index;
