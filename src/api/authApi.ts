import Api from "./axios";

export const userRegister = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await Api.post("/api/user/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const userLogin = async (email: string, password: string) => {
  const response = await Api.post("/api/user/login", { email, password });
  const { token } = response.data;
  localStorage.setItem("userToken", token);
  return response.data;
};
