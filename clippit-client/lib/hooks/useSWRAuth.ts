"use client";

import useSWR, { SWRConfiguration } from "swr"
import { useApi } from "../axios"

export function useSWRAuth<T = any>(url: string | null, config?: SWRConfiguration) {
    const api = useApi();

    return useSWR<T>(
        url,
        async (u: string) => {
            const res = await api.get(u);
            return res.data?.data;
        },
        {
            revalidateOnFocus: true,
            dedupingInterval: 5000,
            ...config,
        }
    )
}