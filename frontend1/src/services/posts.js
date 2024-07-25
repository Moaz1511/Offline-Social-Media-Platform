// frontend/src/services/posts.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts';

export const createPost = (content, token) => {
    return axios.post(API_URL, { content }, {
        headers: { 'Authorization': token }
    });
};

export const getPosts = (token) => {
    return axios.get(API_URL, {
        headers: { 'Authorization': token }
    });
};
