import axios from "axios";

// baseURL 및 Cookie 전달 axios 세팅
const baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:8080"
    : process.env.NEXT_PUBLIC_BASE_URL;
const requestAxios = axios.create({ baseURL });

requestAxios.interceptors.response.use((response) => {
  console.log(response);
  return response;
});

export default requestAxios;
