import React, { createContext, useContext, useState } from "react";

const UserAuthContext = createContext();

export const UserAuthProvider= ({ children }) => {
    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem("user")) || null
    );
    
    const login = (userData) => {
        setUser(userData);
        console.log(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem('user_token', userData.token);
       
        localStorage.setItem('userMobileNumber', userData.contact);
        const user_token = localStorage.getItem('user_token');
        const user_mobileNumber=localStorage.getItem('userMobileNumber');
        console.log(user_token); 
        console.log(user_mobileNumber);


    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <UserAuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </UserAuthContext.Provider>
    );
};

export const useAuth = () => useContext(UserAuthContext);
