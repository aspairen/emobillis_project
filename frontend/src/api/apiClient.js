import axios from 'axios';
// eslint-disable-next-line no-undef
require('dotenv').config()

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL
    ||'http://127.0.0.1:8000/api/', 
    timeout: 5000 ,
});

export default apiClient;
