import BaseApi from "../api/BaseApi";

const friendService = {
  // ambil daftar teman
  getFriends: async () => {
    const response = await BaseApi.get("/friend/list");
    return response.data;
  },

  // tambah teman
  addFriend: async (friendIdentifier) => {
    const response = await BaseApi.post("/friend/add", { friendIdentifier });
    return response.data;
  },
};

export default friendService;
