import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminRoutes from '../adminRoute/AdminRoutes';
 import PublicRoutes from '../publicRoute/PublicRoutes'; // for future e-commerce users
import './appRoutes.css';
const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                
         
                <Route path="/*" element={<PublicRoutes />} />

             
              <Route path="/admin/*" element={<AdminRoutes />} /> 

                 
            </Routes>
        </Router>
    );
};

export default AppRoutes;
