import BaseApi from "../api/BaseApi";

const chatListUsers = async () => {
  const response = await BaseApi.get("/users/list");
  return response.data;
};

export default { chatListUsers };
