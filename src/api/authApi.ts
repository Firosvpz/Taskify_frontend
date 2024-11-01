import Api from "./axios";

export const userRegister = async (username: string, email: string, password: string) => {
    const response = await Api.post('/api/register', { username, email, password })
    return response.data
}

export const userLogin = async ( email: string, password: string) => {
    const response = await Api.post('/api/login', { email, password })
    return response.data
}
