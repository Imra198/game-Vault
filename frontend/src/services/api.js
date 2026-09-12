import axios from "axios";

// Dynamically use live backend URL on Render, or fallback to localhost for dev
export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Custom Axios instance for Express backend requests
export const backendAPI = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Interceptor for backend requests
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

// PROXIED GAME API FUNCTIONS (Routed through Express backend)
export const getGames = async (
  genre = "",
  order = "",
  platform = "",
) => {
  let url = `/games?`;
  if (genre) url += `&genres=${genre}`;
  if (order) url += `&ordering=${order}`;
  if (platform) url += `&parent_platforms=${platform}`;

  const response = await backendAPI.get(url);
  return response.data.results || response.data;
};

export const searchGames = async (
  query,
  genre = "",
  order = "",
  platform = "",
) => {
  let url = `/games?search=${encodeURIComponent(query)}`;
  if (genre) url += `&genres=${genre}`;
  if (order) url += `&ordering=${order}`;
  if (platform) url += `&parent_platforms=${platform}`;

  const response = await backendAPI.get(url);
  return response.data.results || response.data;
};

export const getUpcomingGames = async (platformId = "") => {
  let url = `/games?ordering=-added`;
  if (platformId) url += `&parent_platforms=${platformId}`;

  const response = await backendAPI.get(url);
  return response.data.results || response.data;
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
export const addFavoriteApi = addFavorite;

export const removeFavorite = async (gameId) => {
  const response = await backendAPI.delete(`/users/favorites/${gameId}`);
  return response.data;
};
export const removeFavoriteApi = removeFavorite;

// PROFILE API FUNCTIONS
export const getUserProfile = async () => {
  const response = await backendAPI.get("/profile");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await backendAPI.put("/profile", profileData);
  return response.data;
};