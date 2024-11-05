import axios from "axios";

const Api = axios.create({
    baseURL:"https://taskify-backend-a9yp.onrender.com",
    withCredentials:true
})

export default Api