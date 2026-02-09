// API URL - uses environment variable in production, localhost in development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Proxy Instagram images through our backend to avoid CORS issues
export const getProxyImageUrl = (url) => {
    if (!url) return null;
    if (url.includes('placeholder') || url.includes('abc')) return null;
    if (url.includes('instagram') || url.includes('cdninstagram')) {
        return `${API_URL}/competitors/proxy-image?url=${encodeURIComponent(url)}`;
    }
    return url;
};

// Your Analytics (from Meta Graph API)
export const fetchMyAnalytics = async () => {
    try {
        const response = await fetch(`${API_URL}/analytics/`);
        if (!response.ok) throw new Error("Failed to fetch analytics");
        return await response.json();
    } catch (error) {
        console.error("Analytics API Error:", error);
        return null;
    }
};

// Competitors (from MongoDB - scraped by Apify)
export const fetchCompetitors = async () => {
    try {
        const response = await fetch(`${API_URL}/competitors/`);
        if (!response.ok) throw new Error("Failed to fetch competitors");
        return await response.json();
    } catch (error) {
        console.error("Competitors API Error:", error);
        return [];
    }
};

// Insights (AI generated)
export const fetchInsights = async () => {
    try {
        const response = await fetch(`${API_URL}/insights/`);
        if (!response.ok) throw new Error("Failed to fetch insights");
        return await response.json();
    } catch (error) {
        console.error("Insights API Error:", error);
        return [];
    }
};

// Generate fresh insights
export const generateInsights = async () => {
    try {
        const response = await fetch(`${API_URL}/insights/generate`);
        if (!response.ok) throw new Error("Failed to generate insights");
        return await response.json();
    } catch (error) {
        console.error("Generate Insights Error:", error);
        return null;
    }
};
