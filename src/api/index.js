// axios 设置baseURL 响应拦截器
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success) {
      return response.data;
    }
  },
  (error) => {
    console.log("error: ", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
