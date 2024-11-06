import axios from "axios";

const Api = axios.create({
    baseURL:"https://taskify-backend-qpae.onrender.com",
    headers: {
      'Content-Type': 'application/json',
    },

})

Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
          config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Api  
