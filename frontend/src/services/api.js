import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  
});

// ============================================================
// AUTH TOKEN
// ============================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ============================================================
// AUTH
// ============================================================

export const registerUser = async (
  username,
  email,
  password
) => {
  const response = await API.post(
    "/register",
    {
      username,
      email,
      password,
    }
  );

  return response.data;
};


export const loginUser = async (
  email,
  password
) => {
  const response = await API.post(
    "/login",
    {
      email,
      password,
    }
  );

  const data = response.data;

  if (data.access_token) {
    localStorage.setItem(
      "access_token",
      data.access_token
    );
  }

  return data;
};


export const logoutUser = () => {
  localStorage.removeItem(
    "access_token"
  );
};


// ============================================================
// RESUME ANALYSIS
// ============================================================

export const analyzeResume = async (
  file,
  jobDescription = ""
) => {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "job_description",
    jobDescription
  );

  const response = await API.post(
    "/api/analyze",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// ============================================================
// CHATBOT
// ============================================================

export const chatWithResume = async (
  resumeId,
  question
) => {
  const response = await API.post(
    "/api/chat",
    {
      resume_id: resumeId,
      question,
    }
  );

  return response.data;
};


// ============================================================
// DASHBOARD
// ============================================================

export const getDashboardStats = async () => {
  const response = await API.get(
    "/dashboard/stats"
  );

  return response.data;
};


// ============================================================
// RESUME HISTORY
// ============================================================

export const getMyResumes = async () => {
  const response = await API.get(
    "/my-resumes"
  );

  return response.data;
};


export const getResumeHistory = async () => {
  const response = await API.get(
    "/resume/history"
  );

  return response.data;
};


// ============================================================
// SINGLE RESUME
// ============================================================

export const getResume = async (
  resumeId
) => {
  const response = await API.get(
    `/resume/${resumeId}`
  );

  return response.data;
};


// ============================================================
// DELETE RESUME
// ============================================================

export const deleteResume = async (
  resumeId
) => {
  const response = await API.delete(
    `/resume/${resumeId}`
  );

  return response.data;
};


// ============================================================
// DEFAULT AXIOS INSTANCE
// ============================================================

export default API;