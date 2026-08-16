// ============================================================
// frontend/src/services/api.js
// Resume Screening AI - API Service
// ============================================================

import axios from "axios";


// ============================================================
// AXIOS INSTANCE
// ============================================================

const API = axios.create({

  baseURL: "http://127.0.0.1:8000",

  timeout: 120000,

});


// ============================================================
// AUTH TOKEN INTERCEPTOR
// ============================================================

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(
      error
    );
  }
);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

API.interceptors.response.use(

  (response) => {

    return response;
  },

  (error) => {

    // --------------------------------------------------------
    // Automatically remove invalid token
    // --------------------------------------------------------

    if (
      error.response &&
      error.response.status === 401
    ) {

      localStorage.removeItem(
        "access_token"
      );
    }

    return Promise.reject(
      error
    );
  }
);


// ============================================================
// AUTH
// ============================================================


/**
 * Register a new user.
 */
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


/**
 * Login user and store JWT token.
 */
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

  const data =
    response.data;

  if (
    data.access_token
  ) {

    localStorage.setItem(

      "access_token",

      data.access_token

    );
  }

  return data;
};


/**
 * Logout user.
 */
export const logoutUser = () => {

  localStorage.removeItem(
    "access_token"
  );
};


/**
 * Check whether user is authenticated.
 */
export const isAuthenticated = () => {

  return Boolean(
    localStorage.getItem(
      "access_token"
    )
  );
};


// ============================================================
// RESUME ANALYSIS
// ============================================================


/**
 * Upload and analyze a resume.
 *
 * Supports:
 * - PDF
 * - DOCX
 *
 * Optional:
 * - Job Description
 */
export const analyzeResume = async (

  file,

  jobDescription = ""

) => {

  if (!file) {

    throw new Error(
      "Please select a resume file."
    );
  }

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "job_description",
    jobDescription
  );

  /*
   * Do NOT manually set Content-Type here.
   *
   * The browser/Axios automatically adds:
   *
   * multipart/form-data;
   * boundary=...
   */

  const response =
    await API.post(

      "/api/analyze",

      formData

    );

  return response.data;
};


// ============================================================
// CHATBOT
// ============================================================


/**
 * Ask the AI assistant about a saved resume.
 */
export const chatWithResume = async (

  resumeId,

  question

) => {

  if (!resumeId) {

    throw new Error(
      "Resume ID is required."
    );
  }

  if (
    !question ||
    !question.trim()
  ) {

    throw new Error(
      "Please enter a question."
    );
  }

  const response =
    await API.post(

      "/api/chat",

      {
        resume_id:
          resumeId,

        question:
          question.trim()
      }

    );

  return response.data;
};


// ============================================================
// DASHBOARD
// ============================================================


/**
 * Get dashboard statistics.
 */
export const getDashboardStats =
  async () => {

    const response =
      await API.get(

        "/dashboard/stats"

      );

    return response.data;
  };


// ============================================================
// RESUME LIST / HISTORY
// ============================================================


/**
 * Get all resumes belonging
 * to the logged-in user.
 */
export const getMyResumes =
  async () => {

    const response =
      await API.get(

        "/my-resumes"

      );

    return response.data;
  };


/**
 * Get complete resume history.
 */
export const getResumeHistory =
  async () => {

    const response =
      await API.get(

        "/resume/history"

      );

    return response.data;
  };


// ============================================================
// SINGLE RESUME
// ============================================================


/**
 * Get one saved resume
 * and its complete analysis.
 */
export const getResume =
  async (resumeId) => {

    if (!resumeId) {

      throw new Error(
        "Resume ID is required."
      );
    }

    const response =
      await API.get(

        `/resume/${resumeId}`

      );

    return response.data;
  };


// ============================================================
// DELETE RESUME
// ============================================================


/**
 * Delete a saved resume.
 */
export const deleteResume =
  async (resumeId) => {

    if (!resumeId) {

      throw new Error(
        "Resume ID is required."
      );
    }

    const response =
      await API.delete(

        `/resume/${resumeId}`

      );

    return response.data;
  };


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default API;