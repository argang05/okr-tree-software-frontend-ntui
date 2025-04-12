"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // If on login or register page, don't show header
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-indigo-600 text-white py-4 px-6 flex items-center justify-between shadow-md w-full">
      <div className="flex items-center space-x-2">
        <Link href="/" className="font-bold text-xl">
          OKR Tree
        </Link>
        <span className="bg-indigo-700 text-xs px-2 py-1 rounded">Teams Plugin</span>
      </div>

      {user ? (
        <div className="flex items-center space-x-4">
          <Link href="/my-tasks" className="hover:text-indigo-200 transition-colors">
            My Tasks
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0 w-10 h-10 flex items-center justify-center">
                <Avatar className="h-8 w-8 border-2 border-indigo-400">
                  <AvatarFallback className="bg-indigo-800">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/account">Account Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-indigo-200">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-100">Register</Button>
          </Link>
        </div>
      )}
    </header>
  );
} 