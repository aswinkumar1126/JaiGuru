import React from 'react';
import morningImage from '../../assets/images/morning-img-01.png';
import { useUserProfile } from '../../hooks/profile/useUserProfile';
import {useGreeting} from '../../hooks/greething/useGreeting'
import './welcome.css';

function Welcome() {
    const { data: user } = useUserProfile();
    const greeting = useGreeting();

    return (
        <div className="good-morning-blk">
            <div className="row">
                <div className="col-md-6">
                    <div className="morning-user">
                        <h2>{greeting}, <span>{user?.username || 'Admin'}</span></h2>
                        <p>Have a nice day at work</p>
                    </div>
                </div>
                <div className="col-md-6 position-blk">
                    <div className="morning-img">
                        <img src={morningImage} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;