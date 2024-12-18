import React from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Account from './pages/Account/Account';
import Post from './pages/Post/Post';
import Users from './pages/Users/Users';
import UserPage from './pages/UserPage/UserPage';
import ConfirmEmail from './pages/ConfirmEmail/ConfirmEmail'
import RequestPasswordReset from './pages/RequestPasswordReset/RequestPasswordReset'
import PasswordReset from './pages/PasswordReset/PasswordReset';
import CreatePost from './pages/CreatePost/CreatePost'
import NotFound from './pages/NotFound/NotFound';
import store, { persistor } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import 'highlight.js/styles/github.css';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/sign-up' element={<SignUp />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/posts/:postId" element={<Post />} />
                        <Route path='/users' element={<Users />} />
                        <Route path='/users/:userId' element={<UserPage />} />
                        <Route path="/confirm-email" element={<ConfirmEmail />} />
                        <Route path="/request-password-reset" element={<RequestPasswordReset />} />
                        <Route path="/password-reset/:token" element={<PasswordReset />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </Router>
            </PersistGate>
        </Provider >
    );
};

export default App;
