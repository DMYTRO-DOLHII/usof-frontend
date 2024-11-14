import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import $api from '../../../../api';

const Comment = ({ comment, user }) => {
    const [likeCount, setLikeCount] = useState(comment.likes.filter(like => like.type === 'like').length);
    const [dislikeCount, setDislikeCount] = useState(comment.likes.filter(like => like.type === 'dislike').length);
    const [userLikeType, setUserLikeType] = useState(
        comment.likes.find(like => like.userId === user.id)?.type || null
    );

    const handleLikeDislike = async (type) => {
        if (userLikeType === type) {
            setUserLikeType(null);
            if (type === 'like') setLikeCount(prev => prev - 1);
            if (type === 'dislike') setDislikeCount(prev => prev - 1);
            await $api.delete(`/comments/${comment.id}/likes`);
        } else {
            if (type === 'like') {
                if (userLikeType === 'dislike') setDislikeCount(prev => prev - 1);
                setLikeCount(prev => prev + 1);
            } else {
                if (userLikeType === 'like') setLikeCount(prev => prev - 1);
                setDislikeCount(prev => prev + 1);
            }
            setUserLikeType(type);
            await $api.post(`/comments/${comment.id}/likes`, { type });
        }
    };

    return (
        <div className="comment-card">
            <div className="comment-content">
                <div className="comment-title">{comment.content}</div>
                <div className="comment-meta">
                    Published on: {new Date(comment.publishDate).toLocaleDateString()}
                </div>
                {/* <div className="comment-user">
                    <img src={comment.user.profilePicture} alt={`${comment.user.login}'s profile`} className="user-avatar" />
                    <span>{comment.user.login}</span>
                </div> */}
            </div>
            <div className="comment-likes">
                <span onClick={() => handleLikeDislike('like')}>
                    <FontAwesomeIcon
                        icon={faChevronUp}
                        className={`like-icon ${userLikeType === 'like' ? 'active' : ''}`}
                    />
                    {likeCount}
                </span>
                <span onClick={() => handleLikeDislike('dislike')}>
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`dislike-icon ${userLikeType === 'dislike' ? 'active' : ''}`}
                    />
                    {dislikeCount}
                </span>
            </div>
            <div className={`status-indicator ${comment.status === 'active' ? 'active' : 'inactive'}`}></div>
        </div>
    );
};

export default Comment;
