import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [cookie, setCookie] = useState('');
  const [deleting, setDeleting] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axiosInstance.get('/api/employees');
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.f_name?.toLowerCase().includes(search.toLowerCase()) ||
    employee.f_email?.toLowerCase().includes(search.toLowerCase()) ||
    employee.f_mobile?.toLowerCase().includes(search.toLowerCase()) ||
    employee.f_designation?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    setDeleting(prevState => ({ ...prevState, [id]: true }));
    try {
      await axiosInstance.delete(`/api/employees/${id}`);
      setEmployees(employees.filter(employee => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setDeleting(prevState => ({ ...prevState, [id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

      <div className="container mx-auto px-6 py-4">
        {cookie && (
          <>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search employees...."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 w-full bg-white border rounded-lg shadow-sm"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr>
                    <th className="px-6 py-5 text-left">Name</th>
                    <th className="px-6 py-5 text-left">Email</th>
                    <th className="px-6 py-5 text-left">Mobile</th>
                    <th className="px-6 py-5 text-left">Gender</th>
                    <th className="px-6 py-5 text-left">Course</th>
                    <th className="px-6 py-5 text-left">Designation</th>
                    <th className="px-6 py-5 text-left">Image</th>
                    <th className="px-6 py-5 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map(employee => (
                      <tr key={employee._id} className="border-t border-gray-200 text-sm lg:text-md md:text-md">
                        <td className="px-6 py-3 text-gray-700">{employee.f_name}</td>
                        <td className="px-6 py-3 text-gray-700">{employee.f_email}</td>
                        <td className="px-6 py-3 text-gray-700">{employee.f_mobile}</td>
                        <td className="px-6 py-3 text-gray-700">{employee.f_gender}</td>
                        <td className="px-6 py-3 text-gray-700">{employee.f_course.join(', ')}</td>
                        <td className="px-6 py-3 text-gray-700">{employee.f_designation}</td>
                        <td className="px-6 py-3 text-gray-700">
                          {employee.f_image && (
                            <img
                              src={employee.f_image}
                              alt={employee.f_name}
                              className="w-12 h-12 rounded-full"
                            />
                          )}
                        </td>
                        <td className="px-6 py-3 flex items-center">
                          <Link
                            to={`/edit-employee/${employee._id}`}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm mr-2 hover:bg-indigo-700 transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className={`bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition ${deleting[employee._id] ? 'opacity-50 cursor-not-allowed max-w-[80px]' : 'hover:bg-red-700'}`}
                          >
                            {deleting[employee._id] ? "Deleting" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-6">No employees found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
