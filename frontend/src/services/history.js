import API from "./api";

export const getResumeHistory = async () => {

    const token = localStorage.getItem("token");

    const response = await API.get(
        "/resume/history",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;

};