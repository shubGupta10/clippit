"use client";

import { useApi } from "@/lib/axios";
import { Invite } from "@/lib/types";
import { useSWRAuth } from "./useSWRAuth";

export const useInvites = () => {
    const api = useApi();

    const getPendingInvites = async (): Promise<{ success: boolean; data: Invite[] }> => {
        const response = await api.get('/api/invites/pending');
        return response.data;
    };

    const useUserPendingInvites = () => {
        return useSWRAuth<Invite[]>('/api/invites/pending');
    };

    const sendInvite = async (collectionId: string, email: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.post(`/api/collections/${collectionId}/send-invite`, { email });
        return response.data;
    };

    const acceptInvite = async (inviteId: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.patch(`/api/invites/${inviteId}/accept`);
        return response.data;
    };

    const declineInvite = async (inviteId: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.patch(`/api/invites/${inviteId}/decline`);
        return response.data;
    };

    return {
        getPendingInvites,
        useUserPendingInvites,
        sendInvite,
        acceptInvite,
        declineInvite,
    };
};
