import axios from "axios";
import { signOut } from "next-auth/react";

// baseURL 및 Cookie 전달 axios 세팅
const baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:8080"
    : process.env.NEXT_PUBLIC_BASE_URL;
const requestAxios = axios.create({ baseURL, withCredentials: true });

requestAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 403) {
      await signOut({ redirectTo: "/signin" });
    }
    return Promise.reject(error);
  },
);

export default requestAxios;
