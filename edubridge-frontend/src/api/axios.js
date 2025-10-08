import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://localhost:4010/api/auth",
  withCredentials: true,
});

export const userApi = axios.create({
  baseURL: "http://localhost:4020/api/users",
  withCredentials: true,
});

export const courseApi = axios.create({
  baseURL: "http://localhost:4030/api/courses",
  withCredentials: true,
});

export const enrollmentApi = axios.create({
  baseURL: "http://localhost:4040/api/enrollments",
  withCredentials: true,
});
