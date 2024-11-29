import axios from 'axios';

const base_URL = import.meta.env.VITE_BACKEND_URL;
export const axiosInstance = axios.create({
  baseURL: base_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});