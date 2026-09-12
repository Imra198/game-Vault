import GameCard from "../components/GameCard"
import { useState, useEffect, useCallback } from "react";
import "../css/Home.css"
import { searchGames, getGames } from "../services/api";

function Home() {

    // searchQuery: Holds the current string the user typed (e.g., "GTA V")
    // setSearchQuery: The trigger function used to update that string and re-render the input UI
    const [searchQuery, setSearchQuery] = useState("");

    // Stores the list of video games fetched from the API, defaulting to an empty array ([]) until the data arrives. 
    // 'games' holds the current list, and 'setGames' is the function used to update it.
    const [games, setGames] = useState([]);

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true)

    // Tracks the current genre filter selected by the user, defaulting to an empty string (no filter)
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedOrder, setSelectedOrder] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("");

    // Passes the current search query, genre filter, and sort order to the fetchGames function whenever they change.
    // Also Pass selectedPlatform to fetchGames when it's implemented in the future.
    const fetchGames = useCallback(async (query, genre, order, platform, signal) => {
        setLoading(true);
        setError(null);
        try {
            const results = query.trim()
                ? await searchGames(query, genre, order, platform, signal)
                : await getGames(genre, order, platform, signal);
            setGames(results);
        } catch (err) {
            if (err.name === "AbortError") return;
            console.error(err);
            setError("Failed to load games...");
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchGames(searchQuery, selectedGenre, selectedOrder, selectedPlatform, controller.signal);
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGenre, selectedOrder, selectedPlatform]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim() || loading) return;
        const controller = new AbortController();
        fetchGames(searchQuery, selectedGenre, selectedOrder, selectedPlatform, controller.signal);
    };

    // Declare the container variable for your layout
    let gridContent = null;

    // Use your preferred clean if/else blocks to assign content
    if (loading) {
        gridContent = (
            <div className="loading">
                <p>Loading games from RAWG...</p>
            </div>
        );

    } else if (error) {
        gridContent = (
            <div className="error-message">{error}</div>
        );
    } else if (games.length === 0) {
        gridContent = (
            <div className="no-results">
                <p>No games found. Try a different search.</p>
            </div>
        );
    } else {
        gridContent = (
            <div className="games-grid">
                {games.map((game) => {
                    const isExclusive = game.platforms?.length === 1;

                    return (
                        <GameCard
                            key={game.id}
                            game={game}
                            isExclusive={isExclusive}
                        />
                    );
                })}
            </div>
        );
    }


    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    id="game-search"
                    name="gameSearch"
                    placeholder="Search for games..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="Search-button">Search</button>
            </form>

            <div className="filter-toolbar">
                <div className="filter-group">
                    <label htmlFor="platform-filter">Console:</label>
                    <select
                        id="platform-filter"
                        name="platformFilter"
                        className="filter-select"
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                    >
                        <option value="">All Consoles</option>
                        <option value="2">PlayStation 5</option>
                        <option value="18">PlayStation 4</option>
                        <option value="3">Xbox Series X/S</option>
                        <option value="14">Xbox One</option>
                        <option value="7">Nintendo Switch</option>
                        <option value="1">PC</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="genre-filter">Filter by Genre:</label>
                    <select
                        id="genre-filter"
                        name="genreFilter"
                        className="filter-select"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="">All Genres</option>
                        <option value="action">Action</option>
                        <option value="adventure">Adventure</option>
                        <option value="rpg">RPG</option>
                        <option value="strategy">Strategy</option>
                        <option value="shooter">Shooter</option>
                        <option value="sports">Sports</option>
                        <option value="racing">Racing</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="order-filter">Sort by:</label>
                    <select
                        id="order-filter"
                        name="orderFilter"
                        className="filter-select"
                        value={selectedOrder}
                        onChange={(e) => setSelectedOrder(e.target.value)}
                    >
                        <option value="">Default</option>
                        <option value="-rating">Highest Rated</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="-released">Newest Releases</option>
                    </select>
                </div>
            </div>

            {gridContent}
        </div>
    );
}

export default Home;