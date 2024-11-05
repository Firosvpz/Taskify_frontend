import Api from "./axios";

export const userRegister = async (username: string, email: string, password: string) => {
    const response = await Api.post('/api/user/register', { username, email, password })
    return response.data
}

export const userLogin = async ( email: string, password: string) => {
    const response = await Api.post('/api/user/login', { email, password })
    return response.data
}

export const userLogout = async () => {
    const response = await Api.post('/api/user/logout',{},{withCredentials:true})
    return response.data
}