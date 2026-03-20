"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, FolderHeart } from "lucide-react";

import { useCollections } from "@/lib/hooks/useCollections";
import { useInvites } from "@/lib/hooks/useInvites";
import { Collection, Invite } from "@/lib/types";

import { CollectionCard } from "@/components/collections/CollectionCard";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";
import { PendingInvites } from "@/components/collections/PendingInvites";
import { ShareModal } from "@/components/collections/ShareModal";

export default function CollectionsPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const { getCollections, createCollection, deleteCollection } = useCollections();
    const { getPendingInvites, acceptInvite, declineInvite, sendInvite } = useInvites();

    const [collections, setCollections] = useState<Collection[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [sharingCollectionId, setSharingCollectionId] = useState<string | null>(null);

    const fetchData = async () => {
        setIsFetching(true);
        try {
            const [colRes, invRes] = await Promise.all([
                getCollections(),
                getPendingInvites()
            ]);
            if (colRes.success) setCollections(colRes.data || []);
            if (invRes.success) setInvites(invRes.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load collections data.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) fetchData();
    }, [isLoaded, user]);

    const handleCreate = async (name: string) => {
        try {
            const res = await createCollection(name);
            if (res.success) {
                toast.success("Collection created!");
                setCollections((prev) => [res.data, ...prev]);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create collection.");
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await deleteCollection(id);
            if (res.success) {
                toast.success("Collection deleted.");
                setCollections((prev) => prev.filter(c => c._id !== id));
            }
        } catch (error) {
            toast.error("Failed to delete collection.");
        }
    };

    const handleShare = (id: string) => {
        setSharingCollectionId(id);
        setIsShareModalOpen(true);
    };

    const onShareSubmit = async (email: string) => {
        if (!sharingCollectionId) return;
        try {
            const res = await sendInvite(sharingCollectionId, email);
            if (res.success) {
                toast.success("Invite sent successfully!");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send invite.");
            throw error;
        }
    };

    const handleAcceptInvite = async (id: string) => {
        try {
            const res = await acceptInvite(id);
            if (res.success) {
                toast.success("Invite accepted!");
                fetchData(); // Refresh everything
            }
        } catch (error) {
            toast.error("Failed to accept invite.");
        }
    };

    const handleDeclineInvite = async (id: string) => {
        try {
            const res = await declineInvite(id);
            if (res.success) {
                toast.success("Invite declined.");
                setInvites(prev => prev.filter(i => i._id !== id));
            }
        } catch (error) {
            toast.error("Failed to decline invite.");
        }
    };

    if (!isLoaded || isFetching) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    const myCollections = collections.filter(c => c.owner.clerkId === user?.id);
    const sharedCollections = collections.filter(c => c.owner.clerkId !== user?.id);

    return (
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
            {invites.length > 0 && (
                <PendingInvites
                    invites={invites}
                    onAccept={handleAcceptInvite}
                    onDecline={handleDeclineInvite}
                />
            )}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-foreground tracking-tight">Collections</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{collections.length} {collections.length === 1 ? "collection" : "collections"}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary px-4 py-2 rounded-lg font-medium text-sm transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Collection</span>
                </button>
            </div>

            {collections.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] bg-card rounded-2xl text-center p-8">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <FolderHeart className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No collections yet</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mb-6">
                        Create a collection to organize your saved items and share with your team.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary px-5 py-2 rounded-lg font-medium text-sm transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Collection</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-10">
                    {myCollections.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">My Collections</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                                {myCollections.map(c => (
                                    <div key={c._id} className="mb-5 sm:mb-6">
                                        <CollectionCard
                                            collection={c}
                                            onDelete={handleDelete}
                                            onShare={handleShare}
                                            onClick={() => router.push(`/collections/${c._id}`)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {sharedCollections.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Shared with Me</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                                {sharedCollections.map(c => (
                                    <div key={c._id} className="mb-5 sm:mb-6">
                                        <CollectionCard
                                            key={c._id}
                                            collection={c}
                                            onShare={handleShare}
                                            onClick={() => router.push(`/collections/${c._id}`)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            <CreateCollectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
            />

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => {
                    setIsShareModalOpen(false);
                    setSharingCollectionId(null);
                }}
                onSubmit={onShareSubmit}
            />
        </div>
    );
}
