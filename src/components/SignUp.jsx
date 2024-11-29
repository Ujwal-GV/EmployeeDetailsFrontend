import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignUp() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post('/api/admin/signup', { userName, password });
            if (res.status === 201 || res.status === 200) {
                setLoading(false);
                localStorage.setItem('token', res.data.token);
                navigate('/main');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400 || 401) {
                    setError('Admin already exists');
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
            console.error('Error signing up', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVisibility = () => {
        setVisible(!visible);
    }

    return (
        <div className="min-h-screen flex items-center justify-center mx-4">
           <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6 lg:max-w-md md:max-w-sm sm:w-full">
                <div className="flex gap-8 justify-center mb-6">
                    <img
                        src="/homeImage.png"
                        alt="logo"
                        className="h-23 w-20 lg:h-20 lg:w-30 md:h-30 md:w-30"
                    />
                    <div className='mt-3 lg:mt-7 md:mt-7'>
                        <h1 className="text-2xl font-bold text-center text-gray-800">EMPLOYEE DETAILS</h1>
                        <p className="mt-2 text-center text-gray-600">Sign up to your account</p>
                    </div>
                </div>
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
                    <div className="mb-4 relative">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type={visible ? "text" : "password"}
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span onClick={handleVisibility}>{visible ? <FaEye className='absolute bottom-3 right-3' /> : <FaEyeSlash className='absolute bottom-3 right-3' />}</span>
                    </div>
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                    <button
                        type="submit"
                        className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg transition ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Registering....' : 'Register'}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/" className="text-indigo-600 hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}
