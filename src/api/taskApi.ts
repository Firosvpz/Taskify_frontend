import Api from "./axios";

export const getTasks = async () => {
    const response = await Api.get(`/api/task/tasks`)
    return response.data
}