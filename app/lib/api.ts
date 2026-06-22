import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: true
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      
      const requestUrl = error.config.url;

      if (requestUrl && requestUrl.includes('/auth/signin')) {
        return Promise.reject(error);
      }

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;