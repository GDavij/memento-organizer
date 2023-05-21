"use-client";
import axios from "axios";

axios.interceptors.request.use((config) => {
  config.baseURL = process.env["API_URL"];
  if (config.method != "OPTIONS") {
    config.headers["Authorization"] = localStorage.getItem("token");
  }
  return config;
});

export default axios;
