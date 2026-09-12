import axios from "axios";

// Add unique API Key from .env
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// Base URL for RAWG API
const BASE_URL = "https://api.rawg.io/api";

// Base URL for backend server
export const BACKEND_URL = "http://localhost:5000/api";

// Custom Axios instance ONLY for Express backend requests
export const backendAPI = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Interceptor for backend requests ONLY
backendAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RAWG API FUNCTIONS
export const getGames = async (
  genre = "",
  order = "",
  platform = "",
  signal,
) => {
  let url = `${BASE_URL}/games?key=${API_KEY}`;

  if (genre) url += `&genres=${genre}`;
  if (order) url += `&ordering=${order}`;
  if (platform) url += `&parent_platforms=${platform}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`RAWG API Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results;
};

export const searchGames = async (
  query,
  genre = "",
  order = "",
  platform = "",
  signal,
) => {
  let url = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}`;

  if (genre) url += `&genres=${genre}`;
  if (order) url += `&ordering=${order}`;
  if (platform) url += `&parent_platforms=${platform}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`RAWG API Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results;
};

// AUTH API FUNCTIONS
export const registerUser = async (userData) => {
  const response = await backendAPI.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await backendAPI.post("/auth/login", credentials);
  return response.data;
};

// FAVORITES API FUNCTIONS
export const getFavorites = async () => {
  const response = await backendAPI.get("/users/favorites");
  return response.data;
};

export const addFavorite = async (game) => {
  const response = await backendAPI.post("/users/favorites", game);
  return response.data;
};
export const addFavoriteApi = addFavorite; // Named export expected by GameContext

export const removeFavorite = async (gameId) => {
  const response = await backendAPI.delete(`/users/favorites/${gameId}`);
  return response.data;
};
export const removeFavoriteApi = removeFavorite; // Named export expected by GameContext

// PROFILE API FUNCTIONS
export const getUserProfile = async () => {
  const response = await backendAPI.get("/profile");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await backendAPI.put("/profile", profileData);
  return response.data;
};

export const getUpcomingGames = async (platformId = "") => {
  let url = `${BASE_URL}/games?key=${API_KEY}&ordering=-added`;

  if (platformId) url += `&parent_platforms=${platformId}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch upcoming games");
  }
  const data = await response.json();
  return data.results;
};