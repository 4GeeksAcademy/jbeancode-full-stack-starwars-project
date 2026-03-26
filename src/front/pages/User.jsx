import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const User = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const userEmail = localStorage.getItem("userEmail");

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        dispatch({
            type: "set_user_favorites",
            payload: {
                characters: [],
                planets: []
            }
        });
        navigate("/");
    };

    const fetchUserFavorites = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No authentication token found. Please login first.");
            setLoading(false);
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/favorites`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                setError("Authentication failed. Please login again.");
            } else {
                setError("Failed to fetch favorites");
            }
            setLoading(false);
            return;
        }

        const data = await response.json();
        dispatch({
            type: "set_user_favorites",
            payload: {
                characters: data.favorite_characters || [],
                planets: data.favorite_planets || []
            }
        });
        setLoading(false);
    };

    useEffect(() => {
        fetchUserFavorites();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <h1>Welcome {store.user.email} here are your favorites!</h1>
                <button className="btn btn-danger mb-3" type="button" onClick={handleSignOut}>Sign out</button>
                <p>Loading your favorites...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-5">
                <h1>Welcome {userEmail}, here are your favorites!</h1>
                <button className="btn btn-danger mb-3" type="button" onClick={handleSignOut}>Sign out</button>
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-start">Welcome {userEmail}, here are your favorites!</h1>
                <button className="btn btn-danger" type="button" onClick={handleSignOut}>Sign out</button>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <h2>Favorite Characters</h2>
                    {store.user.favorites.characters.length === 0 ? (
                        <p>No favorite characters yet.</p>
                    ) : (
                        <div className="list-group">
                            {store.user.favorites.characters.map((character) => (
                                <div key={character.id} className="list-group-item">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={character.char_image}
                                            alt={character.name}
                                            className="rounded-circle me-3"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                        <div>
                                            <h5 className="mb-1">{character.name}</h5>
                                            <p className="mb-1">Age: {character.age}</p>
                                            <small className="text-muted">Home Planet: {character.planet}</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-md-6">
                    <h2>Favorite Planets</h2>
                    {store.user.favorites.planets.length === 0 ? (
                        <p>No favorite planets yet.</p>
                    ) : (
                        <div className="list-group">
                            {store.user.favorites.planets.map((planet) => (
                                <div key={planet.id} className="list-group-item">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={planet.planet_image}
                                            alt={planet.name}
                                            className="rounded-circle me-3"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                        <div>
                                            <h5 className="mb-1">{planet.name}</h5>
                                            <p className="mb-1">Terrain: {planet.terrain}</p>
                                            <small className="text-muted">Population: {planet.population.toLocaleString()}</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};