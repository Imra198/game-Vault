import "../css/Favorites.css";
import { useGameContext } from "../contexts/GameContext";
import GameCard from "../components/GameCard";

function Favorites(){
    const { favorites = [] } = useGameContext();
    if (favorites.length === 0) {
        return (
            <div className="favorites-empty">
                <h2>No Favorite Games Yet </h2>
                <p>Start adding games to your favorites and they will appear here</p>
            </div>
        );
    }
    return (
        <div className="favorites">
            <h2>My Favorite Games</h2>
            <div className="game-grid">
            {favorites.map((game, index) => (
                <GameCard key={`${game.id}-${index}`} game={game} />
        ))}
    </div>
        </div>
    );
}

export default Favorites;