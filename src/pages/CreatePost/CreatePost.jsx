import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../store/slices/postSlice';
import { getCategories, clearCategories } from '../../store/slices/categorySlice';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './CreatePost.css';
import $api from '../../api';

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
        setShowWarning(false); // Hide warning when a category is selected
    };

    const handleRemoveCategory = (id) => {
        setSelectedCategories(selectedCategories.filter(cat => cat.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedCategories.length === 0) {
            setShowWarning(true); // Show warning if no category is selected
            return;
        }

        const categoryTitles = selectedCategories.map(cat => cat.title);

        console.log(categoryTitles);

        try {
            const response = await $api.post('/posts', { title, content, categories: categoryTitles });
            console.log(response);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Header />
            <div className="container my-5">
                <h2>Create a New Post</h2>
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
                        <label>Content (Markdown supported)</label>
                        <textarea
                            className="form-control"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="10"
                            required
                        ></textarea>
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
                        {/* Warning message if no categories are selected */}
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
