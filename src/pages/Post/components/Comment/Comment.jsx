import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import $api from '../../../../api';

const Comment = ({ comment, user, isAdmin }) => {
    const [comments, setComments] = useState([]);
    const [likeCount, setLikeCount] = useState(comment.likes.filter(like => like.type === 'like').length);
    const [dislikeCount, setDislikeCount] = useState(comment.likes.filter(like => like.type === 'dislike').length);
    const [userLikeType, setUserLikeType] = useState(
        comment.likes.find(like => like.userId === user.id)?.type || null
    );

    useEffect(() => {
        if (user) {
            setUserLikeType()
        }
    }, []);

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

    const handleDeleteComment = async (commentId) => {

        try {
            await $api.delete(`/comments/${commentId}`);
            setComments((prevComments) => prevComments.filter((c) => c.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
            alert('Failed to delete the comment. Please try again.');
        }
    };

    const countLikesDislikes = (likes) => {
        let like = 0, dislike = 0;
        likes.forEach(like => {
            if (like.type === 'like') like++;
            if (like.type === 'dislike') dislike++;
        });
        return { like, dislike };
    };

    const likesCounts = countLikesDislikes(comment.likes);

    return (
        <div key={comment.id} className="comment-card">
            <div className="comment-content">
                <div className="comment-title">{comment.content}</div>
                <div className="comment-meta">
                    Published on: {new Date(comment.publishDate).toLocaleDateString()}
                </div>
                {(user && (comment.userId === user.id || isAdmin)) && (
                    <button className="btn btn-danger delete-comment">
                        <FontAwesomeIcon
                            icon={faTrash}
                            className='delete-comment-icon'
                            onClick={() => handleDeleteComment(comment.id)}
                        />
                    </button>
                )}
            </div>
            <div className="comment-likes">
                <span>
                    <FontAwesomeIcon icon={faChevronUp} className="like-icon" /> {likesCounts.like}
                </span>
                <span>
                    <FontAwesomeIcon icon={faChevronDown} className="dislike-icon" /> {likesCounts.dislike}
                </span>
            </div>
            <div className={`status-indicator ${comment.status === 'active' ? 'active' : 'inactive'}`}></div>
        </div>
    );
};

export default Comment;
