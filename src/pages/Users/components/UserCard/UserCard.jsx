import React from "react";
import { useNavigate } from "react-router-dom";
import './UserCard.css'

const UserCard = ({ user }) => {
    const navigate = useNavigate();

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleUserCardClick = (userId) => {
        navigate(`/users/${userId}`);
    }

    return (
        <div key={user.id} className="user-card" onClick={() => handleUserCardClick(user.id)}>
            <img
                src={isValidUrl(user.profilePicture)
                    ? user.profilePicture
                    : `${process.env.REACT_APP_BACK_URL_IMG}/${user.profilePicture}`}
                alt={`${user.fullName}'s avatar`}
                className="user-avatar" />
            <h5>{user.fullName}</h5>
            <p>Rating: {user.rating}</p>
        </div>
    );
};

export default UserCard;