import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = '/api'; // This will use your Vercel proxy

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// This function lets us attach an interceptor that pulls the token dynamically
export const setClerkInterceptor = (getToken) => {
  axiosInstance.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
};