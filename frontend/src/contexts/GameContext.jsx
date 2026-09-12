import { createContext, useState, useContext, useEffect } from "react";
import { getFavorites, addFavoriteApi, removeFavoriteApi } from "../services/api";
import { useAuth } from "./AuthContext"; // Import the useAuth hook
const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Get the current user from AuthContext

    // Fetch favorites from Express Backend API on initial mount
    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem("token");

            // Skip API call entirely if no user is logged in
            if (!user || !token) {
                setFavorites([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getFavorites(token);
                if (Array.isArray(data)) {
                    setFavorites(data);
                }
            } catch (error) {
                console.error("Failed to fetch favorites from API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user]); // Re-run effect when user changes

    // Send game payload to Express backend (including genres array)
    const addFavorite = async (game) => {
        const gamePayload = {
            id: game.id,
            name: game.name,
            background_image: game.background_image,
            released: game.released,
            rating: game.rating,
            genres: game.genres || []
        };

        try {
            const updatedFavorites = await addFavoriteApi(gamePayload);
            if (Array.isArray(updatedFavorites)) {
                setFavorites(updatedFavorites);
            }
        } catch (error) {
            console.error("API error adding favorite:", error);
            alert("Failed to save game to favorites. Please check your backend connection.");
        }
    };

    // Remove game from backend database
    const removeFavorite = async (gameId) => {
        try {
            const updatedFavorites = await removeFavoriteApi(gameId);
            if (Array.isArray(updatedFavorites)) {
                setFavorites(updatedFavorites);
            }
        } catch (error) {
            console.error("API error removing favorite:", error);
            alert("Failed to remove game from favorites. Please check your backend connection.");
        }
    };

    const isFavorite = (gameId) => {
        return favorites.some((game) => String(game.id) === String(gameId));
    };

    return (
        <GameContext.Provider value={{ favorites, loading, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </GameContext.Provider>
    );
};