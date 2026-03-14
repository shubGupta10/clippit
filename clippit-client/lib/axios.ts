import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const useApi = () => {
    const { getToken } = useAuth()

    api.interceptors.request.use(async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    })
    return api;
}