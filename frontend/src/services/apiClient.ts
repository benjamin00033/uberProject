import axios from "axios";

const storedUrl = localStorage.getItem("API_BASE_URL");

export const apiClient = axios.create({
  baseURL: storedUrl || import.meta.env.VITE_API_URL,
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const setApiBaseUrl = (url: string) => {
  localStorage.setItem("API_BASE_URL", url);
  apiClient.defaults.baseURL = url;
};
