import axios from "axios";

const API_URL = process.env.REACT_APP_BACK_URL;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})

$api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const request = error.config;

        if (error.response.status = 403) {
            console.log('No rights');
        }

        throw error;
    }
);

export default $api;