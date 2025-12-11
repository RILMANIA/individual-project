import axios from "axios";

export const phase2Api = axios.create({
  baseURL: "https://p2.sonangga.com",
});
