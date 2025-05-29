import React from 'react';
import './DashboardCards.css';

const cardsData = [
    { title: 'Total Users', value: 0, color: '#4caf50' },
    { title: 'Orders', value: 0, color: '#2196f3' },
    { title: 'Pending', value: 0, color: '#ff9800' },
    { title: 'Delivered', value: 0, color: '#009688' },
    { title: 'Cancelled', value: 0, color: '#f44336' },
    { title: 'Review', value: 0, color: '#9c27b0' },
];

const DashboardCards = () => {
    return (
        <div className="cards-grid">
            {cardsData.map(({ title, value, color }, index) => (
                <div key={title} className="card" style={{ backgroundColor: color, '--index': index }}>
                    <h3>{title}</h3>
                    <p>{value}</p>
                </div>
            ))}
        </div>
    );
};

export default DashboardCards;