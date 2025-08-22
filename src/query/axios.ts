import axios from "axios";

const baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:8080/"
    : process.env.NEXT_PUBLIC_BASE_URL;
const requestAxios = axios.create({ baseURL, withCredentials: true });

export default requestAxios;
