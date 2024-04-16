import { baseApi } from "../../../services/baseApi";

export const login = async (username: string, password: string) => {
  return baseApi
    .post("/users/login", { username, password })
    .then((res) => res.data);
};
