import { createRootRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import AlertDialog from '@/components/alert-dialog';
import MobileMenu from '@/components/mobile-menu';


const RootLayout = () => {
  const location = useLocation()
  const pathName = location.pathname

  const today = new Date()
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  const currentTime = today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
  })

  return (
  <div className="flex flex-col h-screen">
    <div className="hidden md:flex place-content-between p-5 mt-5 bg-white/75">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`hover:bg-transparent focus:bg-transparent text-2xl ${pathName === '/' ? 'pointer-events-none' : ''}`}>
              <Link to="/" className="[&.active]:text-amber-500 font-bold text-gray-500 hover:text-amber-600 active:pt-1 active:text-amber-700">
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`hover:bg-transparent focus:bg-transparent text-2xl ${pathName === '/fridge' ? 'pointer-events-none' : ''}`}>
              <Link to="/fridge" className="[&.active]:text-amber-500 font-bold text-gray-500 hover:text-amber-600 active:pt-1 active:text-amber-700">
                Fridge
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`hover:bg-transparent focus:bg-transparent text-2xl ${pathName === '/movies' ? 'pointer-events-none' : ''}`}>
              <Link to="/movies" className="[&.active]:text-amber-500 font-bold text-gray-500 hover:text-amber-600 active:pt-1 active:text-amber-700">
                Movies
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`hover:bg-transparent focus:bg-transparent text-2xl ${pathName === '/events' ? 'pointer-events-none' : ''}`}>
              <Link to="/events" className="[&.active]:text-amber-500 font-bold text-gray-500 hover:text-amber-600 active:pt-1 active:text-amber-700">
                Events
              </Link>
            </NavigationMenuLink>


          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center mr-4 gap-4 text-gray-500 text-2xl font-bold">
        <AlertDialog />
        <p>{ formattedDate } <span className="text-amber-500">|</span> { currentTime }</p>
      </div>
    </div>

    <div className="md:hidden justify-between flex p-5 mt-5 bg-white/75">
      <MobileMenu />
      <div className="flex items-center mr-4 gap-3 text-gray-500 font-bold">
        <AlertDialog isMobile={true} />
        <p>{ formattedDate } <span className="text-amber-500">|</span> { currentTime }</p>
      </div>
    </div>

    <Outlet />
    <TanStackRouterDevtools />
  </div>
  )}

export const Route = createRootRoute({ component: RootLayout });
