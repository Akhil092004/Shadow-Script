'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { LogOut, User as UserIcon, MessageSquareLock } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-800/95 border-b border-slate-600 shadow-lg">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <MessageSquareLock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Shadow Script
              </h1>
              <p className="text-xs text-slate-400 -mt-1">Anonymous messaging</p>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-slate-700 rounded-xl border border-slate-600">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-100">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Mobile User Indicator */}
                <div className="md:hidden flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-100">
                    {user?.username || 'User'}
                  </span>
                </div>

                {/* Logout Button */}
                <Button 
                  onClick={() => signOut()} 
                  variant="outline"
                  className="flex items-center space-x-2 px-4 py-2 border-2 border-slate-600 hover:border-red-400 hover:bg-red-500/10 hover:text-red-400 text-slate-300 transition-all duration-200 rounded-xl font-medium bg-slate-700/50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button 
                    variant="outline"
                    className="flex items-center space-x-2 px-6 py-2 border-2 border-slate-600 hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-400 text-slate-300 transition-all duration-200 rounded-xl font-medium bg-slate-700/50"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button 
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;