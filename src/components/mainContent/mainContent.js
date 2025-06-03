import React, { useContext } from 'react';
import DashboardCards from '../cards/DashboardCards';
import ChartsSection from '../charts/ChartsSection';
import styles from './mainContent.css';
import TopContent from '../topContent/topContent';
import { MyContext } from '../../context/themeContext/themeContext';

const MainContent = () => {
    const { themeMode } = useContext(MyContext); // Get themeMode from context

    return (
        <main className={`${styles.main} ${themeMode === 'dark' ? 'dark' : 'light'}`}>
            <TopContent />
            <DashboardCards />
            <ChartsSection />
        </main>
    );
};

export default MainContent;