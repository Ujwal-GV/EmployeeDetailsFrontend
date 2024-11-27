import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://employee-details-backend.vercel.app', // Your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});