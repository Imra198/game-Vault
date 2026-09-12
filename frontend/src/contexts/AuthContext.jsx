import { createContext, useContext, useState, useEffect } from "react";
import {loginUser, registerUser} from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    // load saved user state from localStorage when app boots up
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        // If both user and token are found in localStorage, set them in state
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }

        setLoading(false);
    }, []);

    // Handle Login 
    const login = async (credentials) => {
        const data = await loginUser(credentials); // returns { token, user }
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
    };

    // Handle Registration
    const register = async (userData) => {
        const data = await registerUser(userData); // returns { token, user }
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
    };

    // Handle Logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                token, 
                loading, 
                login,
                register, 
                logout 
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};