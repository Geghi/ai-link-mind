import axios from "axios";

const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
