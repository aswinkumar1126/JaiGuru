import React, { createContext, useContext, useState } from "react";

// 1️⃣ Create the context
const CompanyContext = createContext({
    companyName: "SANDIYA FOUNDATIONS CHENNAI LLP",
    setCompanyName: () => { },
});

// 2️⃣ Create provider
export const CompanyProvider = ({ children }) => {
    const [companyName, setCompanyName] = useState("SANDIYA FOUNDATIONS CHENNAI LLP");

    return (
        <CompanyContext.Provider value={{ companyName, setCompanyName }}>
            {children}
        </CompanyContext.Provider>
    );
};

// 3️⃣ Custom hook for easy access
export const useCompany = () => useContext(CompanyContext);
