import React from 'react';
import DashImage from '../../assets/images/dashboardimg.png';
import './TopContent.css';

function TopContent() {
    return (
        <div className="right-content">
            <div className="page-header">
                <ul className="breadcrumb">
                    <li className="breadcrumb-item">Dashboard</li>
                    <li className="breadcrumb-item"><i className="fas fa-angle-right"></i></li>
                    <li className="breadcrumb-item active">Admin Dashboard</li>
                </ul>
            </div>

            <div className="good-morning-blk">
                <div className="morning-content">
                    <div className="morning-text">
                        <h2>Good Morning, <span>Admin</span></h2>
                        <p>Have a nice day at work</p>
                    </div>
                    <div className="morning-img">
                        <img src={DashImage} alt="Dashboard Illustration" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopContent;