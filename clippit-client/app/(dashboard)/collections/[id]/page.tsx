"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Share2, Users, AlertCircle, FolderHeart } from "lucide-react";

import { useCollections } from "@/lib/hooks/useCollections";
import { useInvites } from "@/lib/hooks/useInvites";
import { useApi } from "@/lib/axios";
import { Collection } from "@/lib/types";

import { ItemCard } from "@/components/items/ItemCard";
import { ShareModal } from "@/components/collections/ShareModal";
import { MemberAvatar } from "@/components/collections/MemberAvatar";

export default function CollectionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const { getCollectionById } = useCollections();
    const { sendInvite } = useInvites();
    const api = useApi();

    const [collection, setCollection] = useState<Collection | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCollection = async () => {
        setIsFetching(true);
        setError(null);
        try {
            const res = await getCollectionById(id);
            if (res.success) {
                setCollection(res.data);
            } else {
                setError("Collection not found or access denied.");
            }
        } catch (err: any) {
            if (err?.response?.status === 403) {
                setError("You do not have permission to view this collection.");
            } else {
                setError("Failed to load collection.");
            }
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user && id) fetchCollection();
    }, [isLoaded, user, id]);

    const handleShare = async (email: string) => {
        try {
            const res = await sendInvite(id, email);
            if (res.success) {
                toast.success("Invite sent successfully!");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send invite. Make sure user exists.");
            throw error;
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            // Note: This deletes from application, falling back to basic REST pattern.
            await api.delete(`/api/items/delete-item/${itemId}`);
            toast.success("Item deleted");
            setCollection((prev) => 
                prev ? { ...prev, itemIds: prev.itemIds.filter((it) => it._id !== itemId) } : prev
            );
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    if (!isLoaded || isFetching) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-muted-foreground flex items-center gap-3">
                    <FolderHeart className="w-6 h-6 animate-bounce text-primary" />
                    <span>Loading collection...</span>
                </div>
            </div>
        );
    }

    if (error || !collection) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
                <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
                <button
                    onClick={() => router.push("/collections")}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                    &larr; Back to Collections
                </button>
            </div>
        );
    }

    const isOwner = collection.owner.clerkId === user?.id;

    return (
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-border/50 pb-6">
                <div>
                    <button
                        onClick={() => router.push("/collections")}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors w-fit"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                            <FolderHeart className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            {collection.name}
                        </h1>
                    </div>
                    {!isOwner && (
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span>Owned by</span>
                            <span className="font-semibold text-foreground">
                                {collection.owner.firstName} {collection.owner.lastName}
                            </span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4 bg-muted/30 p-2 pl-4 rounded-2xl border border-border/50 overflow-visible">
                    {/* Members List */}
                    <div className="flex items-center gap-3 pr-4 border-r border-border/50 overflow-visible">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="mr-3">{collection.members.length + 1}</span>
                        </div>
                        <div className="flex -space-x-2">
                            <MemberAvatar
                                key="owner-avatar"
                                firstName={collection.owner.firstName}
                                lastName={collection.owner.lastName}
                                fullName={`${collection.owner.firstName} ${collection.owner.lastName} (Owner)`}
                                tooltipAlign={collection.members.length === 0 ? "right" : "center"}
                            />
                            {collection.members.map((member, index) => (
                                <MemberAvatar
                                    key={`member-${member._id || index}`}
                                    firstName={member.firstName}
                                    lastName={member.lastName}
                                    fullName={`${member.firstName} ${member.lastName}`}
                                    tooltipAlign={index === collection.members.length - 1 ? "right" : "center"}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Share Button (Owner Only) */}
                    {isOwner && (
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            {collection.itemIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] bg-card border border-border/50 rounded-2xl shadow-sm text-center p-8">
                    <FolderHeart className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">This collection is empty</h3>
                    <p className="text-muted-foreground max-w-md">
                        Add items to this collection from your Dashboard or use the Clippit browser extension to save directly here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 auto-rows-[300px]">
                    {collection.itemIds.map((item, index) => (
                        <ItemCard
                            key={item._id || `item-${index}`}
                            item={item}
                            onDelete={handleDeleteItem}
                        />
                    ))}
                </div>
            )}

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                onSubmit={handleShare}
            />
        </div>
    );
}
