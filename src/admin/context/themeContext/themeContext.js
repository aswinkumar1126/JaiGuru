import React, { createContext, useState, useEffect } from 'react';

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
    // Detect screen size to determine initial sidebar state
    const isLargeScreen = window.innerWidth >= 768; // ≥768px is considered a larger screen
    const [themeColor, setThemeColor] = useState('#f4f4f4'); // Default header background color
    const [isSidebarOpen, setIsSidebarOpen] = useState(isLargeScreen); // Always open on larger screens
    const [themeMode, setThemeMode] = useState('light'); // Light/dark mode

    // Update sidebar state on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true); // Always open on larger screens
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const contextValues = {
        themeColor,
        setThemeColor,
        isSidebarOpen,
        setIsSidebarOpen,
        themeMode,
        setThemeMode,
    };

    return (
        <MyContext.Provider value={contextValues}>
            {children}
        </MyContext.Provider>
    );
};