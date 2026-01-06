const API_URL = "http://localhost:8000/api";

export interface SiteConfig {
    key: string;
    value: string;
    type: string;
    group: string;
}

export interface Promotion {
    id: number;
    title: string;
    description: string;
    image_path: string | null;
    discount_percentage: number | null;
    is_active: boolean;
}

// Map array of configs to a key-value object for easier usage
export const formatConfig = (configs: SiteConfig[]) => {
    return configs.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);
};

export const fetchContent = async (group?: string) => {
    try {
        const url = group ? `${API_URL}/content/${group}` : `${API_URL}/content`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch content");
        const data = await res.json();
        return formatConfig(data);
    } catch (error) {
        console.error("Error fetching content:", error);
        return {};
    }
};

export const fetchPromotions = async () => {
    try {
        const res = await fetch(`${API_URL}/promotions`);
        if (!res.ok) throw new Error("Failed to fetch promotions");
        return await res.json() as Promotion[];
    } catch (error) {
        console.error("Error fetching promotions:", error);
        return [];
    }
}

// ... existing interfaces
export interface Project {
    id: number;
    title: string;
    category: string;
    year: string;
    location: string;
    image_path: string;
    alt_text?: string;
}

export interface Service {
    id: number;
    title: string;
    description: string;
    image_path: string;
}

export const fetchProjects = async () => {
    try {
        const res = await fetch(`${API_URL}/projects`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        return await res.json() as Project[];
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export const fetchServices = async () => {
    try {
        const res = await fetch(`${API_URL}/services`);
        if (!res.ok) throw new Error("Failed to fetch services");
        return await res.json() as Service[];
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}

export const sendMessage = async (data: { sender_name: string; contact_info: string; content: string }) => {
    const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return await res.json();
};

export const getImageUrl = (path: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:8000${path}`;
}
