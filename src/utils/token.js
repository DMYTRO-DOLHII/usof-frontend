import { jwtDecode } from 'jwt-decode';

export const decodeToken = token => {
    if (!token) {
        throw new Error('No token provided');
    }

    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const decodeTokenLogin = token => {
    if (!token) {
        throw new Error('No token provided');
    }

    try {
        const decoded = jwtDecode(token);
        return decoded ? decoded.login : null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};