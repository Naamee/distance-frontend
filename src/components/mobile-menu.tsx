import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/menu-dialog';
import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Link, useLocation } from '@tanstack/react-router';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const pathName = location.pathname

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Fridge", path: "/fridge" },
    { name: "Movies", path: "/movies" },
    { name: "Events", path: "/events" },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-gradient-to-b from-gray-200 to-gray-400 border-white hover:from-amber-200 hover:to-amber-500 hover:border-amber-600 active:from-amber-400 active:to-amber-600 active:border-amber-700 text-white hover:text-amber-600"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          aria-description='mobile-menu'
          className="
          fixed bottom-10 w-full h-full mt-24
          bg-white/75
          border-s-none
          backdrop-blur-sm
          shadow-none
          rounded-none
        "
        >
          <DialogDescription className="hidden">Mobile Menu</DialogDescription>
          <DialogTitle className="hidden">Menu</DialogTitle>
          <div className="flex flex-col gap-5 w-full">
            {
              navItems.map(item => (
                <Link
                  to={item.path}
                  key={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full text-2xl text-start active:text-amber-700 font-bold ${pathName === item.path ? 'text-amber-500' : 'text-gray-500'} inline-flex items-center justify-center px-4 py-2 hover:bg-gray-100 rounded`}
                >
                  {item.name}
                </Link>
              ))
            }
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
