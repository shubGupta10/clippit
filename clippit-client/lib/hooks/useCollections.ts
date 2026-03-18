import { useApi } from "@/lib/axios";
import { Collection } from "@/lib/types";

export const useCollections = () => {
    const api = useApi();

    const getCollections = async (): Promise<{ success: boolean; data: Collection[] }> => {
        const response = await api.get('/api/collections');
        return response.data;
    };

    const getCollectionById = async (id: string): Promise<{ success: boolean; data: Collection }> => {
        const response = await api.get(`/api/collections/${id}`);
        return response.data;
    };

    const createCollection = async (name: string): Promise<{ success: boolean; data: Collection }> => {
        const response = await api.post('/api/collections/create', { name });
        return response.data;
    };

    const deleteCollection = async (id: string): Promise<{ success: boolean; data: Collection }> => {
        const response = await api.delete(`/api/collections/${id}/delete`);
        return response.data;
    };

    const addItemToCollection = async (collectionId: string, itemId: string): Promise<{ success: boolean; data: Collection }> => {
        const response = await api.patch(`/api/collections/${collectionId}/add-item`, { itemId });
        return response.data;
    };

    const removeItemFromCollection = async (collectionId: string, itemId: string): Promise<{ success: boolean; data: Collection }> => {
        const response = await api.patch(`/api/collections/${collectionId}/remove-item`, { itemId });
        return response.data;
    };

    return {
        getCollections,
        getCollectionById,
        createCollection,
        deleteCollection,
        addItemToCollection,
        removeItemFromCollection,
    };
};
