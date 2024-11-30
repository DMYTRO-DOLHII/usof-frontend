import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../store/slices/postSlice';
import { getCategories, clearCategories } from '../../store/slices/categorySlice';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './CreatePost.css';
import MarkdownIt from 'markdown-it';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import $api from '../../api';

const mdParser = new MarkdownIt(
    {
        breaks: true, // Включает поддержку переносов строк
        gfm: true
    }
);

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const categories = useSelector(state => state.category.categories);

    const handleEditorChange = ({ text }) => {
        setContent(text);
    };

    const handleCategoryChange = (e) => {
        const searchTerm = e.target.value;
        setCategoryInput(searchTerm);

        if (searchTerm) {
            dispatch(getCategories(searchTerm));
            setShowSuggestions(true);
        } else {
            dispatch(clearCategories());
            setShowSuggestions(false);
        }
        setShowWarning(false); // Hide warning when typing a category
    };

    const handleCategorySelect = (selectedCategory) => {
        if (!selectedCategories.some(cat => cat.id === selectedCategory.id)) {
            setSelectedCategories([...selectedCategories, selectedCategory]);
        }
        setCategoryInput('');
        setShowSuggestions(false);
        dispatch(clearCategories());
        setShowWarning(false);
    };

    const handleRemoveCategory = (id) => {
        setSelectedCategories(selectedCategories.filter(cat => cat.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedCategories.length === 0) {
            setShowWarning(true);
            return;
        }

        const categoryIdx = selectedCategories.map(cat => cat.id);

        try {
            const response = await $api.post('/posts', { title, content, categories: categoryIdx });
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Header />
            <div className="container my-5">
                <h2>Create New Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-post">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-post">
                        <label>Content</label>
                        <MarkdownEditor
                            value={content}
                            style={{ height: '500px' }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={handleEditorChange}
                            placeholder="Write your post here..."
                        />
                    </div>

                    <div className="form-group-post">
                        <label>Category</label>
                        <input
                            type="text"
                            className="form-control"
                            value={categoryInput}
                            onChange={handleCategoryChange}
                        />
                        {showSuggestions && (
                            <div className="suggestions-dropdown" style={{ width: '100%' }}>
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="suggestion-item"
                                        onClick={() => handleCategorySelect(cat)}
                                    >
                                        <strong>{cat.title}</strong>
                                        <p>{cat.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {showWarning && (
                            <p className="warning-text">Please select at least one category.</p>
                        )}
                    </div>

                    <div className="selected-categories">
                        {selectedCategories.map(cat => (
                            <div key={cat.id} className="category-card">
                                <div className="category-info">
                                    <strong>{cat.title}</strong>
                                    <p>{cat.description}</p>
                                </div>
                                <button
                                    type="button"
                                    className="remove-category-btn"
                                    onClick={() => handleRemoveCategory(cat.id)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
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
