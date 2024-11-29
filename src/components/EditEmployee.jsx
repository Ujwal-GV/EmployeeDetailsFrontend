import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';
import Cookies from 'js-cookie';

export default function EditEmployee() {
  const [f_name, setName] = useState('');
  const [f_email, setEmail] = useState('');
  const [f_mobile, setMobile] = useState('');
  const [f_designation, setDesignation] = useState('');
  const [f_gender, setGender] = useState('');
  const [f_course, setCourse] = useState([]);
  const [f_image, setImage] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [cookie, setCookie] = useState('');
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const name = Cookies.get('name');
    if (name) {
      setCookie(name);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/employees/${id}`);
        setName(data.f_name);
        setEmail(data.f_email);
        setMobile(data.f_mobile);
        setDesignation(data.f_designation);
        setGender(data.f_gender);
        setCourse(JSON.parse(data.f_course.join(',')));
        setExistingImage(data.f_image);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    fetchEmployee();
  }, [id]);

  useEffect(() => {
    localStorage.setItem('selectedCourses', JSON.stringify(f_course));
  }, [f_course]);

  useEffect(() => {
    const storedCourses = localStorage.getItem('selectedCourses');
    if (storedCourses) {
      setCourse(JSON.parse(storedCourses));
    }
  }, []);

  const handleCourseChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCourse([...f_course, value]);
    } else {
      setCourse(f_course.filter(course => course !== value));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('f_name', f_name);
    formData.append('f_email', f_email);
    formData.append('f_mobile', f_mobile);
    formData.append('f_designation', f_designation);
    formData.append('f_gender', f_gender);
    formData.append('f_course', JSON.stringify(f_course));
    if (f_image instanceof File) {
      formData.append('f_image', f_image);
    } else {
      formData.append('f_image', existingImage);
    }
    setUpdating(true);
    try {
      await axiosInstance.put(`/api/employees/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUpdating(false);
      navigate('/employees');
    } catch (error) {
      console.error('Error updating employee:', error.response ? error.response.data : error.message);
    } finally {
      setUpdating(false);
    }
  };

  const getSelectedCoursesDisplay = () => {
    return f_course.join(', ');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
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
                checked={f_gender === 'Male'}
                onChange={(e) => setGender(e.target.value)}
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                value="Female"
                checked={f_gender === 'Female'}
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
                  checked={f_course.includes(course)}
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
          className={`w-full py-2 px-4 bg-indigo-600 transition ${updating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'} text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75`}
        >
          {updating ? "Updating...." : "Update Employee"}
        </button>
      </form>
    </div>
  );
}
