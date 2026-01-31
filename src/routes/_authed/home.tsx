import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const Route = createFileRoute("/_authed/home")({
  component: HomeLayout,
});

function HomeLayout() {
  const location = useLocation();

  // Determine current tab from pathname
  const getCurrentTab = () => {
    if (location.pathname.includes("/home/learning-path")) {
      return "/home/learning-path";
    }
    if (location.pathname.includes("/home/review")) {
      return "/home/review";
    }
    return "/explore";
  };

  const currentTab = getCurrentTab();

  return (
    <div className="flex flex-col grow">
      <Tabs
        value={currentTab}
        className="flex flex-col justify-start h-full w-full"
      >
        <div className="flex w-full justify-center items-center fixed bottom-1 z-50 lg:relative lg:pt-5">
          <TabsList className="w-80 shadow-xl rounded-xl justify-around bg-accent h-10">
            <TabsTrigger
              className="w-full rounded-lg text-accent-foreground h-full"
              value="/learning-path"
              asChild
            >
              <Link to="/learning-path">Trilha</Link>
            </TabsTrigger>
            <TabsTrigger
              className="w-full rounded-lg text-accent-foreground h-full"
              value="/explore"
              asChild
            >
              <Link to="/explore">Explorar</Link>
            </TabsTrigger>
            <TabsTrigger
              className="w-full rounded-lg text-accent-foreground h-full"
              value="/review"
              asChild
            >
              <Link to="/review">Revisao</Link>
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="lg:px-10">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}
