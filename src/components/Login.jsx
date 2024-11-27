import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { axiosInstance } from '../utils/axiosInstance';

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login Payload:", { userName, password }); 
        try {
            const res = await axiosInstance.post('/api/admin/login', { userName, password });
            if (res.data.token) {
                Cookies.set('name', userName);
                localStorage.setItem('token', res.data.token);
                navigate('/main');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401 || 400) {
                    setError('Invalid credentials');
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
            console.error('Error logging in', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-400">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6 lg:max-w-md md:max-w-sm sm:w-full">
                <div className="flex justify-center mb-6">
                    <img
                        src="/homeImage.png"
                        alt="logo"
                        className="h-20 w-20 lg:h-6 lg:w-16 md:h-4 md:w-14 sm:h-12 sm:w-12"
                    />
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-800">EMPLOYEE DETAILS</h1>
                <p className="mt-2 text-center text-gray-600">Sign into your account</p>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-indigo-600 hover:underline">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
}
