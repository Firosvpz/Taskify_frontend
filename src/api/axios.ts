import axios from "axios";

const Api = axios.create({
    baseURL:"https://task-management-backend-bu1a.onrender.com",
    withCredentials:true
})

Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Api  
