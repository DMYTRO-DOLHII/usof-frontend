import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useDispatch } from 'react-redux';
import { useHistory, useNavigate } from 'react-router-dom';
import { createPost } from '../../store/slices/postSlice';
import './CreatePost.css';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch an action to create a new post
        dispatch(createPost({ title, content, category }));
        navigate('/');
    };

    return (
        <>
            <Header />
            <div className="container my-5">
                <h2>Create a New Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Content (Markdown supported)</label>
                        <textarea
                            className="form-control"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="10"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            className="form-control"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">
                        Submit
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default CreatePost;
