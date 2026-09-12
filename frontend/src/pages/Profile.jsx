import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import "../css/Profile.css";

const AVAILABLE_PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState('');
    const [platforms, setPlatforms] = useState([]);
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getUserProfile();
            console.log("PROFILE API RESPONSE:", data); // Check favorites array structure
            setProfile(data);
            setBio(data?.user?.bio || '');
            setPlatforms(data?.user?.platforms || data?.user?.favoritePlatforms || []);
            setAvatar(data?.user?.avatar || '');
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlatformToggle = (platform) => {
        if (platforms.includes(platform)) {
            setPlatforms(platforms.filter((p) => p !== platform));
        } else {
            setPlatforms([...platforms, platform]);
        }
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size exceeds 2MB limit.');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const updated = await updateUserProfile({ bio, favoritePlatforms: platforms, avatar });

            setProfile((prev) => ({
                ...prev,
                user: {
                    ...prev?.user,
                    bio: updated.bio,
                    platforms: updated.platforms || updated.favoritePlatforms || platforms,
                    avatar: updated.avatar || avatar
                }
            }));
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update user profile details.');
        }
    };

    if (loading) return <div className="loading"><p>Loading User Profile...</p></div>;
    if (!profile) return <div className="error">Profile not Found</div>;

    const { user = {}, favorites = [] } = profile;

    // 1. Calculate local stats if backend stats don't exist
    const calculateGenreStats = favorites.reduce((acc, game) => {
        const gameGenres = Array.isArray(game.genres) ? game.genres : [];
        gameGenres.forEach((genre) => {
            const genreName = typeof genre === 'object' ? (genre.name || 'Other') : genre;
            acc[genreName] = (acc[genreName] || 0) + 1;
        });
        return acc;
    }, {});

    const totalGenreCount = Object.values(calculateGenreStats).reduce((sum, count) => sum + count, 0);

    const calculatedStats = Object.entries(calculateGenreStats).map(([genre, count]) => ({
        genre,
        // MUST BE A NUMBER FOR RECHARTS
        percentage: totalGenreCount > 0 ? parseFloat(((count / totalGenreCount) * 100).toFixed(1)) : 0
    }));

    // 2. Select backend stats or fallback to calculated stats
    const backendStats = Array.isArray(profile.stats) ? profile.stats : [];
    const statsToDisplay = backendStats.length > 0 ? backendStats : calculatedStats;

    return (
        <div className="profile-container">
            {/* Profile Section */}
            <section className="profile-header">
                <img
                    src={avatar || user.avatar || 'https://via.placeholder.com/150'}
                    alt={user.username || 'User Avatar'}
                    className="profile-avatar"
                />
                <div className="profile-details">
                    <h2>{user.username || 'Gamer'}</h2>

                    {isEditing ? (
                        <div className="edit-form">
                            <label>Profile Picture:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                style={{ marginBottom: '15px' }}
                            />
                            <label>Bio:</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows="3"
                            />

                            <label>Favorite Platforms:</label>
                            <div className="platform-checkboxes">
                                {AVAILABLE_PLATFORMS.map((p) => (
                                    <label key={p} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={platforms.includes(p)}
                                            onChange={() => handlePlatformToggle(p)}
                                        />
                                        {p}
                                    </label>
                                ))}
                            </div>

                            <div className="edit-actions">
                                <button onClick={handleSave} className="save-btn">Save Changes</button>
                                <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="profile-bio">{user.bio || "No bio added yet."}</p>

                            <div className="platforms-list">
                                <strong>Favorite Platforms:</strong>
                                {(user.platforms?.length || user.favoritePlatforms?.length) ? (
                                    (user.platforms || user.favoritePlatforms).map((p) => (
                                        <span key={p} className="platform-tag">{p}</span>
                                    ))
                                ) : (
                                    <span> None Selected</span>
                                )}
                            </div>

                            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
                        </>
                    )}
                </div>
            </section>

            {/* Gaming Stats Section */}
            <section className="profile-section">
                <h3>Gaming Stats (Genre Breakdown)</h3>
                {statsToDisplay && statsToDisplay.length > 0 ? (
                    <div className="stats-chart" style={{ width: '100%', height: '300px', minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statsToDisplay}
                                    dataKey="percentage"
                                    nameKey="genre"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={(entry) => `${entry.genre}: ${entry.percentage}%`}
                                >
                                    {statsToDisplay.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p>Add games to your favorites to generate genre stats!</p>
                )}
            </section>

            {/* Activity History Section */}
            <section className="profile-section">
                <h3>Recent Activity & Saved Games</h3>
                <div className="activity-list">
                    <h4>Favorite Games ({favorites.length})</h4>
                    {favorites.length > 0 ? (
                        <ul>
                            {favorites.slice(0, 5).map((game, index) => (
                                <li key={`${game._id || game.id}-${index}`}>{game.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No favorites saved yet.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Profile;