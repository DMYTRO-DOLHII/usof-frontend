import React from 'react';
import './Comment.css';

const Comment = ({ content, publishDate, status }) => (
    <div className="comment">
        <p className="comment-content">{content}</p>
        <div className="comment-meta">
            <small>
                Published on: {new Date(publishDate).toLocaleDateString()} | Status:
                <span className={`status ${status === 'active' ? 'status-active-text' : 'status-inactive-text'}`}>
                    {status}
                </span>
            </small>
        </div>
    </div>
);

export default Comment;
