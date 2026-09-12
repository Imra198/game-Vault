import { FaHeart } from "react-icons/fa";
import "../css/GameCard.css"
import { useGameContext } from "../contexts/GameContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function GameCard({ game }) {
    const { addFavorite, removeFavorite, isFavorite } = useGameContext();
    const favorite = isFavorite(game.id);
    const { user } = useAuth();
    const navigate = useNavigate();

    function handleFavoriteClickBtn(e) {

        // Restricting the favorite button functionality to logged-in users only
        if (!user) {
            alert("Please log in to save games to your favorites.");
            navigate("/login");
            return;
        }
        e.preventDefault();
        if (favorite) {
            removeFavorite(game.id);
        } else {
            addFavorite(game);
        }
    }

    const releaseYear = game.released ? game.released.split("-")[0] : "N/A";

    // Extract platform names provided by the RAWG API
    const parentPlatforms = game.parent_platforms?.map((p) => p.platform.name) || [];

    // Automatically determine exclusive based on a single parent  platform
    const isExclusive = game.platforms?.length === 1;
    const platformDisplay = parentPlatforms.join(", ");

    return <div className="game-card">
        <div className="game-poster">
            <img
                src={game.background_image}
                alt={game.name}
                loading="lazy"
            />

            <span className={`exclusive-badge ${isExclusive ? "exclusive" : "multiplatform"}`}>
                {isExclusive ? `${parentPlatforms[0]} Exclusive` : "Multiplatform"}
            </span>

            <div className="game-overlay">
                <button
                    className={`favorite-btn ${favorite ? "active" : ""}`}
                    onClick={handleFavoriteClickBtn}
                    aria-label={favorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
                >
                    <FaHeart />
                </button>
            </div>
        </div>
        <div className="game-info">
            <h3>{game.name}</h3>
            {/* displays release year */}
            <p>{releaseYear}</p>
        </div>
    </div>
}


export default GameCard;