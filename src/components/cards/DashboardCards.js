import React from 'react';
import './DashboardCards.css';

const cardsData = [
    { title: 'Total Users', value: 0, gradient: 'linear-gradient(90deg, rgb(13, 192, 22),rgb(51, 218, 59))' },
    { title: 'Orders', value: 0, gradient: 'linear-gradient(90deg, rgb(32, 132, 214),rgb(29, 128, 209))' },
    { title: 'Pending', value: 0, gradient: 'linear-gradient(90deg, rgb(212, 201, 38),rgb(224, 213, 55))' },
    { title: 'Delivered', value: 0, gradient: 'linear-gradient(90deg, rgb(14, 212, 193),rgb(19, 202, 184))' },
    { title: 'Cancelled', value: 0, gradient: 'linear-gradient(90deg, rgb(238, 26, 11),rgb(221, 31, 31))' },
    { title: 'Review', value: 0, gradient: 'linear-gradient(90deg, rgb(200, 22, 231),rgb(169, 17, 196))' },
];

const DashboardCards = () => {
    return (
        <div className="cards-grid">
            {cardsData.map(({ title, value, gradient }, index) => (
                <div key={index} className="card" style={{ background: gradient }}>
                    <h3>{title}</h3>
                    <p>{value}</p>
                </div>
            ))}
        </div>
    );
};

export default DashboardCards;
