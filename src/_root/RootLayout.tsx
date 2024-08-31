import Bottombar from "@/components/shared/Bottombar";
import Leftbar from "@/components/shared/Leftbar";
import Topbar from "@/components/shared/Topbar";
import { useUserContext } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { user } = useUserContext();

  return (
    <div className="w-full md:flex">
      <Topbar />
      <Leftbar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
