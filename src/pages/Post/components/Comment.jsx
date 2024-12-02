import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { marked } from 'marked';
import $api from '../../../api';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

const Comment = ({ comment, user, isAdmin, onSumbitReply, onHandleDeleteReply, onHandleDeleteComment, onCommentLikeDislike }) => {
    const navigate = useNavigate();
    const [userCommentLikeStatus, setCommentLikeStatus] = useState();

    useEffect(() => {
        setCommentLikeStatus(getUserLikeStatus(comment.likes, user?.id));
    },)

    // Helper functions (to be implemented later)
    const countLikesDislikes = (entity, isPost = false) => {
        let likeCount = 0, dislikeCount = 0;
        entity.likes.forEach(like => {
            if (isPost && like.commentId) return;
            if (like.type === 'like') likeCount++;
            if (like.type === 'dislike') dislikeCount++;
        });
        return { likeCount, dislikeCount };
    };

    const getUserLikeStatus = (likes, userId) => {
        if (!likes || !userId) return '';
        const userLike = likes.find((like) => like.userId === userId);
        return userLike ? userLike.type : '';
    };

    const handleCommentLikeDislike = async (commentId, type) => {
        if (!user) {
            displayNotLoggedInPopUp('You need to log in to like or dislike a comment.');
            return;
        }

        try {
            const updatedComment = await onCommentLikeDislike(commentId, type); // Call parent function
            if (updatedComment) {
                const updatedStatus = getUserLikeStatus(updatedComment.likes, user?.id);
                setCommentLikeStatus(updatedStatus);
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to update like/dislike status.', 'error');
        }
    };

    const displayNotLoggedInPopUp = (text) => {
        Swal.fire({
            title: 'Not Logged In',
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Log In',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/login');
            }
        });
    };

    const showReplyInput = (commentId) => {
        Swal.fire({
            title: 'Reply to Comment',
            input: 'textarea',
            inputPlaceholder: 'Type your reply here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const replyContent = result.value;
                submitReply(commentId, replyContent);
            }
        });
    }

    const submitReply = async (commentId, replyContent) => {
        if (onSumbitReply) onSumbitReply(commentId, replyContent);
    }

    const handleReply = (commentId) => {
        if (!localStorage.getItem('token')) {
            displayNotLoggedInPopUp('You need to log in to reply to a comment.');
        } else {
            showReplyInput(commentId);
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (onHandleDeleteComment) onHandleDeleteComment(commentId);
    };

    const handleDeleteReply = async (commentId, replyId) => {
        if (onHandleDeleteReply) onHandleDeleteReply(commentId, replyId)
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Extract likes/dislikes data
    const { likeCount, dislikeCount } = countLikesDislikes(comment);

    return (
        <div className="comment-card">
            <div className="comment-card-content">
                <div className="comment-content">
                    <div
                        className="comment-text"
                        dangerouslySetInnerHTML={{ __html: marked(comment.content) }}
                    ></div>
                    <div className="comment-meta">
                        {new Date(comment.publishDate).toLocaleString()}
                    </div>
                    <div className="comment-user-info">
                        <Link to={`/users/${comment.user.id}`} className="user-link">
                            <img
                                src={isValidUrl(comment.user.profilePicture)
                                    ? comment.user.profilePicture
                                    : `${process.env.REACT_APP_BACK_URL_IMG}/${comment.user.profilePicture}`}
                                alt={`${comment.user.login}'s profile`}
                                className="user-pic"
                            />
                            {comment.user.login}
                        </Link>
                    </div>
                </div>
                <div className="comment-info-section">
                    <div className="comment-likes">
                        <span>
                            <FontAwesomeIcon
                                icon={faChevronUp}
                                className={`like-icon ${userCommentLikeStatus === 'like' ? 'active-like' : ''}`}
                                onClick={() => handleCommentLikeDislike(comment.id, 'like')}
                            />{' '}
                            {likeCount}
                        </span>
                        <span>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`dislike-icon ${userCommentLikeStatus === 'dislike' ? 'active-dislike' : ''}`}
                                onClick={() => handleCommentLikeDislike(comment.id, 'dislike')}
                            />{' '}
                            {dislikeCount}
                        </span>
                    </div>
                    <div
                        className={`status-indicator ${comment.status === 'active' ? 'active' : 'inactive'
                            }`}
                    ></div>
                </div>
            </div>
            <hr />
            <div className="replies-section">
                {comment.replies &&
                    comment.replies.length > 0 &&
                    comment.replies
                        .map((reply) => (
                            <div key={reply.id} className="reply-card">
                                <div className="reply-card-content">
                                    <div className="reply-content">
                                        <div>
                                            {reply.content} -{' '}
                                            <Link to={`/users/${reply.user.id}`}>{reply.user.login}</Link>
                                        </div>
                                        <div className="reply-meta">
                                            {new Date(reply.publishDate).toLocaleString()}
                                        </div>
                                    </div>
                                    {(user && (reply.userId === user.id || isAdmin)) && (
                                        <button className="btn delete-reply">
                                            <FontAwesomeIcon
                                                icon={faDeleteLeft}
                                                className="delete-reply-icon"
                                                onClick={() => handleDeleteReply(comment.id, reply.id)}
                                            />
                                        </button>
                                    )}
                                </div>
                                <hr />
                            </div>
                        ))}
                <button className="reply-button" onClick={() => handleReply(comment.id)}>
                    Reply
                </button>
            </div>
            {(user && (comment.userId === user.id || isAdmin)) && (
                <button className="btn delete-comment">
                    <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-comment-icon"
                        onClick={() => handleDeleteComment(comment.id)}
                    />
                </button>
            )}
        </div>
    );
};

export default Comment;
