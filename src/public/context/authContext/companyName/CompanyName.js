import React, { useEffect, useState, createContext, useContext } from "react";
import getCompanyName from "../../../service/companyName";

const CompanyNameContext = createContext(null);

export const CompanyNameProvider = ({ children }) => {
    const [companyName, setCompanyName] = useState(null);

    useEffect(() => {
        const fetchCompanyName = async () => {
            try {
                const response = await getCompanyName();
                setCompanyName(response);
            } catch (error) {
                console.error('Error fetching company name:', error);
            }
        };

        fetchCompanyName();
    }, []);

    return (
        <CompanyNameContext.Provider value={companyName}>
            {children}
        </CompanyNameContext.Provider>
    );
};

export const useCompanyName = () => useContext(CompanyNameContext);
