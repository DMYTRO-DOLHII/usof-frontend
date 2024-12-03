import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faEdit, faDeleteLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Comment from './components/Comment';
import $api from '../../api';
import { decodeToken } from '../../utils/token';
import './Post.css';
import { marked } from 'marked';
import hljs from 'highlight.js';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setSearch } from '../../store/slices/postSlice';

marked.setOptions({
    gfm: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: (code, lang) => {
        if (hljs.getLanguage(lang)) {
            return hljs.highlight(lang, code).value;
        } else {
            return hljs.highlightAuto(code).value;
        }
    },
});

const Post = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const previewRef = useRef();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentsError, setCommentsError] = useState(null);
    const [sortOrder, setSortOrder] = useState('dateCreated');
    const [userLikeStatus, setUserLikeStatus] = useState('');
    const [user, setUser] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [favouriteCount, setFavouriteCount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(null);

    const [isPostCreator, setIsPostCreator] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let decodedUser = null;
                if (token) {
                    decodedUser = decodeToken(token);
                    setUser(decodedUser);
                }

                const response = await $api.get(`/posts/${postId}`);
                if (response.status === 404) {
                    navigate('/404');
                    return;
                }

                const postData = response.data;
                setFavouriteCount(postData.favourites.length);
                setUpdatedContent(postData.content);
                setPost(postData);

                // Execute dependent logic here after both are available
                if (decodedUser && postData) {
                    const userLike = postData.likes.find(like => like.userId === decodedUser.id);
                    if (userLike) setUserLikeStatus(userLike.type);

                    const userFavourite = postData.favourites.find(favourite => favourite.userId === decodedUser.id);
                    setIsFavourite(!!userFavourite);

                    setIsPostCreator(decodedUser.id === postData.userId);
                    setIsAdmin(decodedUser.role === 'admin');
                }
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            }
        };

        fetchData();
    }, [token, postId, navigate]);


    useEffect(() => {
        if (previewRef.current) {
            hljs.highlightAll();
        }
    }, [post]);

    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const response = await $api.get(`/posts/${postId}/comments`);
            const sortedComments = sortComments(response.data, sortOrder);

            setComments(sortedComments);
        } catch (err) {
            setCommentsError(err.message);
        } finally {
            setCommentsLoading(false);
        }
    };

    const sortComments = (comments, order) => {
        switch (order) {
            case 'highestScore':
                return [...comments].sort((a, b) =>
                    b.likes.filter(like => like.type === 'like').length -
                    a.likes.filter(like => like.type === 'like').length
                );
            case 'active':
                return [...comments].filter(comment => comment.status === 'active');
            case 'dateCreated':
            default:
                return [...comments].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        }
    };

    useEffect(() => {
        fetchComments();
    }, [sortOrder]);

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const countLikesDislikes = (entity, isPost = false) => {
        let likeCount = 0, dislikeCount = 0;
        entity.likes.forEach(like => {
            if (isPost && like.commentId) return;
            if (like.type === 'like') likeCount++;
            if (like.type === 'dislike') dislikeCount++;
        });
        return { likeCount, dislikeCount };
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const updatePostContent = async (content) => {
        const response = await $api.patch(`/posts/${postId}/`, { content });
        console.log(response.data);
        return response.data;
    };

    const handleSaveChanges = async () => {
        try {
            await updatePostContent(updatedContent);
            post.content = updatedContent;
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const handleLeaveComment = () => {
        if (!user) {
            displayNotLoggedInPopUp('You need to be logged in to leave a comment.');
        } else {
            setShowCommentForm(true);
        }
    };

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentContent, setCommentContent] = useState('');

    const handleCommentContentChange = (e) => {
        setCommentContent(e.target.value);
    };

    const handleSubmitComment = async () => {
        if (!commentContent) {
            Swal.fire('Error', 'Please enter a comment', 'error');
            return;
        }

        try {
            const response = await $api.post(`/posts/${postId}/comments`, {
                content: commentContent,
            });

            if (response.status !== 201) {
                throw new Error('Failed to submit comment.');
            }

            setComments((prevComments) => [
                response.data.comment,
                ...prevComments,
            ]);

            setShowCommentForm(false);
            setCommentContent('');
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
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


    const handleLikeDislike = async (type) => {
        if (!user) displayNotLoggedInPopUp("You need to log in to like/dislike.")

        try {
            const response = await $api.post(`/posts/${postId}/like`, { type });

            if (type === userLikeStatus) {
                setPost((prevPost) => ({
                    ...prevPost,
                    likes: prevPost.likes.filter((like) => like.userId !== user.id),
                }));
                setUserLikeStatus(null);
                return;
            } else {
                if (type === 'like') {
                    setPost((prevPost) => ({
                        ...prevPost,
                        likes: [
                            ...prevPost.likes.filter((like) => like.userId !== user.id),
                            { userId: user.id, type: 'like' },
                        ],
                    }));
                } else if (type === 'dislike') {
                    setPost((prevPost) => ({
                        ...prevPost,
                        likes: [
                            ...prevPost.likes.filter((like) => like.userId !== user.id),
                            { userId: user.id, type: 'dislike' },
                        ],
                    }));
                }

                setUserLikeStatus(type);
            }
        } catch (err) {
            console.error('Failed to like/dislike post:', err);
        }
    };

    const handleCommentLikeDislike = async (commentId, type) => {
        if (!user) {
            Swal.fire('Not Logged In', 'You need to log in to like/dislike comments.', 'warning');
            return null;
        }

        try {
            const response = await $api.post(`/comments/${commentId}/like`, { type });
            const updatedComment = response.data.comment;

            // Update the comments state
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            likes: updatedComment.likes, // Update only the replies field
                          }
                        : comment
                )
            );

            return updatedComment.comment; // Return the updated comment object
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
            return null;
        }
    };

    const getUserLikeStatus = (likes, userId) => {
        if (!likes || !userId) return '';
        const userLike = likes.find((like) => like.userId === userId);
        return userLike ? userLike.type : '';
    };

    const handleDeletePost = async () => {
        try {
            await $api.delete(`/posts/${postId}`);
            navigate('/');
        } catch (err) {
            console.error('Failed to delete post:', err);
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

    const handleReply = (commentId) => {
        if (!token) {
            displayNotLoggedInPopUp('You need to log in to reply to a comment.');
        } else {
            showReplyInput(commentId);
        }
    }

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
        try {
            const response = await $api.post(`/comments/${commentId}/reply`, { content: replyContent });

            if (response.status !== 200) {
                throw new Error('Failed to submit reply.');
            }

            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, replies: [...comment.replies, response.data] } // Add the new reply
                        : comment
                )
            );
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    }

    const handleDeleteReply = async (commentId, replyId) => {
        try {
            const response = await $api.delete(`/comments/${replyId}/reply`);

            if (response.status !== 200) {
                throw new Error('Failed to delete reply.');
            }

            setComments(prevComments => {
                return prevComments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: comment.replies.filter(reply => reply.id !== replyId),
                        };
                    }
                    return comment;
                });
            });

        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const handleFavouriteClick = async () => {
        try {
            if (!user) {
                displayNotLoggedInPopUp('You need to log in to save a post as favourite.');
                return
            }

            if (isFavourite) {
                const response = await $api.delete(`/favourite/${postId}`);

                if (response.status !== 204) {
                    throw new Error(response.data);
                }
                setFavouriteCount(favouriteCount - 1);
                setIsFavourite(false);
            } else {
                const response = await $api.post(`/favourite/${postId}`);

                if (response.status !== 201) {
                    throw new Error(response.data);
                }
                setFavouriteCount(favouriteCount + 1);
                setIsFavourite(true);
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error')
        }
    }

    const handleCategoryClick = async (categoryTitle) => {
        dispatch(setSearch(`-c ${categoryTitle}`))
        navigate('/');
    }


    if (error) return <p className="text-danger">{error}</p>;

    const postLikes = post ? countLikesDislikes(post, true) : { likeCount: 0, dislikeCount: 0 };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="post-content">
                {post && (
                    <div className="post-card-single">
                        <h1 className="post-title gradient">{post.title}</h1>
                        {post.categories && post.categories.length > 0 ? (
                            <ul className="category-list list-unstyled">
                                {post.categories.map((category) => (
                                    <li key={category.id} className="category-item">
                                        <span onClick={(e) => handleCategoryClick(category.title)}>{category.title}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span>No categories available</span>
                        )}
                        <p className="post-meta">
                            Published on: {new Date(post.publishDate).toLocaleDateString()}
                        </p>
                        <p>
                            Status:
                            <span className={`status ${post.status === 'active' ? 'status-active-text' : 'status-inactive-text'}`}>
                                {post.status}
                            </span>
                        </p>
                        <div className="post-likes">
                            <span onClick={() => handleLikeDislike('like')}>
                                <FontAwesomeIcon
                                    icon={faChevronUp}
                                    className={`like-icon ${userLikeStatus === 'like' ? 'active-like' : ''}`}
                                /> {postLikes.likeCount}
                            </span>
                            <span onClick={() => handleLikeDislike('dislike')}>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`dislike-icon ${userLikeStatus === 'dislike' ? 'active-dislike' : ''}`}
                                /> {postLikes.dislikeCount}
                            </span>
                            <span>
                                <FontAwesomeIcon
                                    icon={isFavourite ? faBookmarkSolid : faBookmarkRegular}
                                    className={`bookmark-icon ${isFavourite ? 'favourite' : ''}`}
                                    onClick={() => handleFavouriteClick()}
                                /> {favouriteCount}
                            </span>
                        </div>

                        <div className="post-body" ref={previewRef}>
                            {isEditing ? (
                                <textarea
                                    value={updatedContent}
                                    onChange={(e) => setUpdatedContent(e.target.value)}
                                    className="content-editor"
                                />
                            ) : (
                                <div className='prose prose-lg' ref={previewRef} dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
                            )}
                        </div>

                        <div className="post-user-info">
                            <Link to={`/users/${post.user.id}`}>
                                <img
                                    src={isValidUrl(post.user.profilePicture)
                                        ? post.user.profilePicture
                                        : `${process.env.REACT_APP_BACK_URL_IMG}/${post.user.profilePicture}`}
                                    className="post-user-avatar" />
                                {post.user.login}
                            </Link>
                        </div>

                        {(isPostCreator || isAdmin) && (
                            <div className='action-buttons'>
                                <button onClick={handleDeletePost} className="btn btn-danger">
                                    <FontAwesomeIcon icon={faTrash} /> Delete Post
                                </button>
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSaveChanges} className="btn btn-success">
                                            <FontAwesomeIcon icon={faSave} /> Save
                                        </button>
                                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                                            <FontAwesomeIcon icon={faTimes} /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="btn btn-primary button-edit">
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}


                <button className="btn leave-comment-button" onClick={handleLeaveComment}>
                    Leave a Comment
                </button>

                {showCommentForm && (
                    <div className="comment-form">
                        <textarea
                            placeholder="Write your comment..."
                            value={commentContent}
                            onChange={handleCommentContentChange}
                        />
                        <button className="submit-comment-button" onClick={handleSubmitComment}>
                            Submit Comment
                        </button>
                        <button className="cancel-comment-button" onClick={() => setShowCommentForm(false)}>
                            Cancel
                        </button>
                    </div>
                )}

                <div className="comments-section">
                    <h3>Comments</h3>
                    <div className="sort-container">
                        <label htmlFor="sort-comments">Sort by:</label>
                        <select id="sort-comments" value={sortOrder} onChange={handleSortChange} className="sort-dropdown">
                            <option value="highestScore">Highest Score</option>
                            <option value="active">Active</option>
                            <option value="dateCreated">Date Created</option>
                        </select>
                    </div>

                    {commentsLoading ? (
                        <p>Loading comments...</p>
                    ) : commentsError ? (
                        <p className="text-danger">{commentsError}</p>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                user={user}
                                isAdmin={isAdmin}
                                onSumbitReply={submitReply}
                                onHandleDeleteReply={handleDeleteReply}
                                onHandleDeleteComment={handleDeleteComment}
                                onCommentLikeDislike={handleCommentLikeDislike}
                            />
                        ))
                    ) : (
                        <p>No comments available for this post.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Post;
