import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check user's login status and set the isLoggedIn state accordingly
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        
  
        });

        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setIsLoggedIn(false);
        router.push('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Inventory Management System</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          {isLoggedIn ? (
            <div>
               <a href='/home' className="mr-5 hover:text-gray-900 cursor-pointer">
              Home
            </a>
               <a onClick={handleLogout} className="mr-5 hover:text-gray-900 cursor-pointer">
              Logout
            </a>
           
           
            </div>
           
            
          ) : (
            <>
              <Link href="/" className="mr-5 hover:text-gray-900">
                Login
              </Link>
              <Link href="/register" className="mr-5 hover:text-gray-900">
                SignUp
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;