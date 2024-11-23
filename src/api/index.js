import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_BACK_URL_API;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `${localStorage.getItem('token')}`;
    return config;
})

$api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 404) {
            window.location.href = '/404';
        }
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const token = localStorage.getItem('token');
                const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, { token });
                const newToken = refreshResponse.data.token;

                localStorage.setItem('token', newToken);
                originalRequest.headers.Authorization = `${newToken}`;
                return $api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                return Promise.reject(refreshError);
            }
        }

        if (error.response && error.response.status === 403) {
            console.log('No rights');
        }

        return Promise.reject(error);
    }
);

export default $api;