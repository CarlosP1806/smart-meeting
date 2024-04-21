import { baseApi } from "../../../services/baseApi";

export const login = async (username: string, password: string) => {
  return baseApi
    .post("/users/login", { username, password })
    .then((res) => res.data);
};

export const signup = async (form: FormData) => {
  return baseApi.post("/users/signup", form).then((res) => res.data);
};
