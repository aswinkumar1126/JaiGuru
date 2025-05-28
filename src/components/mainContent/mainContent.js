import React from 'react';
import DashboardCards from '../cards/DashboardCards';
import ChartsSection from '../charts/ChartsSection';
import styles from './mainContent.css'; // Import CSS module

const MainContent = () => {
    return (
        <main className={styles.main}>
            <DashboardCards />
            <ChartsSection />
        </main>
    );
};

export default MainContent;