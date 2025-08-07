import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://localhost:4010/api/auth",
  withCredentials: true, // send/receive cookies
});

export const userApi = axios.create({
  baseURL: "http://localhost:4020/api/users",
  withCredentials: true,
});
