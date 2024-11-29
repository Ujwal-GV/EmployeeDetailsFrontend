import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();
  const [cookie, setCookie] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const name = Cookies.get('name');
    if (name) {
      setCookie(name);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    Cookies.remove('name');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <nav className="bg-gray-200 shadow-md w-full z-10 p-4">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <a
            href="/main"
            className="absolute left-4 text-xl font-bold text-gray-800 no-underline"
          >
            EMPLOYEE DETAILS
          </a>

          <div className="absolute right-3 hidden md:flex items-center space-x-8">
            <a
              href="/main"
              className="text-gray-700 hover:text-indigo-600 font-medium no-underline transition"
            >
              Home
            </a>
            <a
              href="/employees"
              className="text-gray-700 hover:text-indigo-600 font-medium no-underline transition"
            >
              Employee List
            </a>
            <a
              href="/create-employee"
              className="text-gray-700 hover:text-indigo-600 font-medium no-underline transition"
            >
              Create Employee
            </a>
            {cookie && (
              <>
                <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
                  {cookie}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            className="absolute right-7 md:hidden text-2xl font-bold text-gray-800 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-20 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:hidden`}
      >
        <div className="flex flex-col items-start p-6 space-y-6">
          <a
            href="/main"
            className="text-gray-700 hover:text-indigo-600 font-medium no-underline transition"
            onClick={() => setIsSidebarOpen(false)}
          >
            Home
          </a>
          <a
            href="/employees"
            className="text-gray-700 hover:text-indigo-600 font-medium no-underline transition"
            onClick={() => setIsSidebarOpen(false)}
          >
            Employee List
          </a>
          <a
              href="/create-employee"
              className="text-gray-700 hover:text-indigo-600 font-medium no-underline transition"
            >
              Create Employee
            </a>
          {cookie && (
            <>
              <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
                {cookie}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setIsSidebarOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {cookie && (
        <div className="flex flex-col items-center justify-center mt-24 px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome to the Dashboard
          </h2>
          <p className="mt-4 text-gray-600">
            Manage employees and explore features.
          </p>
          <a
            href="/create-employee"
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg text-lg transition shadow-md no-underline"
          >
            Create Employee
          </a>
        </div>
      )}
    </div>
  );
}
