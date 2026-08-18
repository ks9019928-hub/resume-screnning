// ============================================================
// frontend/src/services/dashboard.js
// Dashboard API Services
// ============================================================

import API from "./api";


// ============================================================
// GET DASHBOARD STATISTICS
// ============================================================

export const getDashboardStats = async () => {

    const response = await API.get(
        "/dashboard/stats"
    );

    return response.data;
};