import { faChevronUp, faChevronDown, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './PostCard.css'

const PostCard = ({ post }) => {
    const navigate = useNavigate();

    const handleCardClick = (postId) => {
        navigate(`/posts/${postId}`);
    };

    const isValidUrl = (string) => {
        try {
            console.log(string)
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    return (
        <div key={post.id} className="col-md-4 mb-4" onClick={() => handleCardClick(post.id)}>
            <div className={`card post-card ${post.status === 'active' ? 'hover-active' : 'hover-inactive'}`}>
                <div className={`status-circle ${post.status === 'active' ? 'status-active' : 'status-inactive'}`}></div>
                <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <small className="text-muted">
                        Published on: {new Date(post.publishDate).toLocaleDateString()}
                    </small>
                    <div className="mt-2">
                        {post.categories && post.categories.length > 0 ? (
                            <ul className="category-list list-unstyled">
                                {post.categories.map((category) => (
                                    <li key={category.id} className="category-item">
                                        {category.title}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span>No categories available</span>
                        )}
                    </div>
                    {/* Likes and Dislikes */}
                    <div className="likes-info">
                        <div className='likes'><FontAwesomeIcon icon={faChevronUp} className="like-icon" /> {post.likes}</div>
                        <div className='disliked'><FontAwesomeIcon icon={faChevronDown} className="dislike-icon" /> {post.dislikes}</div>
                    </div>

                    {/* Display User Information */}
                    <div className="d-flex align-items-center user-info">
                        <img
                            src={isValidUrl(post.user.profilePicture)
                                ? post.user.profilePicture
                                : `${process.env.REACT_APP_BACK_URL_IMG}/${post.user.profilePicture}`}
                            alt={post.user.login}
                            className="rounded-circle me-2"
                            style={{ width: '30px', height: '30px' }}
                        />
                        <Link to={`/users/${post.user.id}`} className="text-decoration-none">
                            {post.user.login}
                        </Link>
                    </div>
                </div>
                {/* Comment Icon and Count */}
                <div className="comments-info">
                    <FontAwesomeIcon icon={faComment} /> {post.commentsCount}
                </div>
            </div>
        </div>
    );
}

export default PostCard;