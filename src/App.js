import React from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Post from './pages/Post/Post';
import Users from './pages/Users/Users';
import ConfirmEmail from './pages/ConfirmEmail/ConfirmEmail'
import NotFound from './pages/NotFound/NotFound';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path="/posts/:postId" element={<Post />} />
                <Route path='/users' element={<Users />} />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
