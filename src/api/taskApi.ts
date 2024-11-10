import Api from "./axios";

export const getTasks = async () => {
  const response = await Api.get(`/api/task/tasks`);
  return response.data;
};

export const createTasks = async (
  title: string,
  status: "pending" | "completed",
) => {
  const response = await Api.post("/api/task/create-task", { title, status });
  return response.data;
};

export const updateTasks = async (
  id: string,
  title: string,
  status: "pending" | "completed",
) => {
  const response = await Api.put(`/api/task/update-task/${id}`, {
    title,
    status,
  });
  return response.data;
};

export const completeTasks = async (id: string) => {
  const response = await Api.patch(`/api/task/complete-task/${id}`, {
    status: "completed",
  });
  return response.data;
};

export const deleteTasks = async (id: string) => {
  const response = await Api.delete(`/api/task/delete-task/${id}`);
  return response.data;
};
