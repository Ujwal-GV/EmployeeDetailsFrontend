import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';

export default function CreateEmployee() {
  const [f_name, setName] = useState('');
  const [f_email, setEmail] = useState('');
  const [f_mobile, setMobile] = useState('');
  const [f_designation, setDesignation] = useState('');
  const [f_gender, setGender] = useState('');
  const [f_course, setCourse] = useState([]);
  const [f_image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [cookie, setCookie] = useState('');
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = Cookies.get('name');
    if (name) {
      setCookie(name);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setWaiting(true);
    const formData = new FormData();
    formData.append('f_name', f_name);
    formData.append('f_email', f_email);
    formData.append('f_mobile', f_mobile);
    formData.append('f_designation', f_designation);
    formData.append('f_gender', f_gender);
    formData.append('f_course', JSON.stringify(f_course));
    formData.append('f_image', f_image);

    try {
      const response = await axiosInstance.post('/api/employees/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setWaiting(false);
      navigate('/employees');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError(error.response.data.message);
        } else if (error.response.status === 500) {
          setError('Server error, please try again later');
        } else {
          setError('An unknown error occurred');
        }
      } else if (error.request) {
        setError('No response from the server');
      } else {
        setError('Error in setting up request');
      }
    } finally {
        setWaiting(false);
    }
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCourse([...f_course, value]);
    } else {
      setCourse(f_course.filter((course) => course !== value));
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create Employee</h2>
      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-2"
            value={f_name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-2"
            value={f_email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile:</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-2"
            value={f_mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Designation:</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 px-3"
            value={f_designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender:</label>
          <div className="mt-1 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                value="Male"
                onChange={(e) => setGender(e.target.value)}
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                value="Female"
                onChange={(e) => setGender(e.target.value)}
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Course:</label>
          <div className="mt-1 space-y-2">
            {['MCA', 'BCA', 'BSC'].map((course) => (
              <label key={course} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600"
                  value={course}
                  onChange={handleCourseChange}
                />
                <span className="ml-2">{course}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image:</label>
          <input
            type="file"
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-2"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className={`
                w-full py-2 px-4 bg-indigo-600 transition ${waiting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'} text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75
            `}
        >
          {waiting ? "Creating...." : "Create Employee"}
        </button>
      </form>
    </div>
  );
}
