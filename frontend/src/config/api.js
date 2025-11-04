import axios from 'axios';

// Single place to set your backend URL for the entire frontend
// Order of precedence:
// 1) Vite env (VITE_API_URL) when building locally
// 2) window.__APP_API_URL__ (you can inject this in index.html without rebuild)
// 3) Hardcoded default below (set to your current Dev Tunnel backend)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.__APP_API_URL__) || 
  'https://8fp9fvw1-7000.inc1.devtunnels.ms';

//"http://localhost:7000"||
export const axiosAPI = axios.create({
  baseURL: API_BASE_URL,
});

export const buildUrl = (path = '/') => `${API_BASE_URL}${path}`;

export const buildUploadUrl = (filename = '') => {
  if (!filename) return `${API_BASE_URL}/uploads/`;
  if (/^https?:\/\//i.test(filename)) return filename; // already absolute
  const clean = filename.replace(/^\/+/, '');
  return `${API_BASE_URL}/${clean.startsWith('uploads') ? clean : `uploads/${clean}`}`;
};
