import {
  createRootRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import AlertDialog from "@/components/alert-dialog";
import MobileMenu from "@/components/mobile-menu";

const RootLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Fridge", path: "/fridge" },
    { name: "Movies", path: "/movies" },
    { name: "Events", path: "/events" },
  ];

  return ['/login', '/register'].includes(pathName) ? (
    <Outlet />
  ) : (
    <div className="flex flex-col h-screen">
      {/* Nav Menu */}
      <div className="hidden md:flex place-content-between p-5 mt-5 bg-white/75">
        <NavigationMenu>
          <NavigationMenuList>
              {
                navItems.map(item => (
                  <NavigationMenuItem key={item.path}>
                  <NavigationMenuLink
                    asChild
                    className={`hover:bg-transparent focus:bg-transparent text-2xl ${pathName === item.path ? "pointer-events-none" : ""}`}
                  >
                    <Link
                      to={item.path}
                      className="[&.active]:text-amber-500 font-bold text-gray-500 hover:text-amber-600 active:pt-1 active:text-amber-700"
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                  </NavigationMenuItem>
                ))
              }
          </NavigationMenuList>
        </NavigationMenu>
        <AlertDialog />
      </div>

      {/* Nav Menu - Mobile */}
      <div className="md:hidden justify-between flex p-5 mt-5 bg-white/75">
        <MobileMenu />
        <AlertDialog isMobile={true} />
      </div>

      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({ component: RootLayout });
