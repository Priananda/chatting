import BaseApi from "../api/BaseApi";

const userProfile = async () => {
  const response = await BaseApi.get("/users/me");
  return response.data;
};

export default userProfile;
