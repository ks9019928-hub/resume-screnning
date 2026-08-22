import API from "./api";

export const getResumeHistory = async () => {
  const response = await API.get("/resume/history");
  return response.data;
};