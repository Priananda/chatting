import BaseApi from "../api/BaseApi";

const register = async (formData) => {
  const response = await BaseApi.post("/users/register", formData);
  return response.data;
};

const login = async (formData) => {
  const response = await BaseApi.post("/users/login", formData);
  return response.data;
};

export default { register, login };
