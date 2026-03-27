"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Share2, Users, AlertCircle, FolderHeart, SearchX } from "lucide-react";

import { useCollections } from "@/lib/hooks/useCollections";
import { useInvites } from "@/lib/hooks/useInvites";
import { useApi } from "@/lib/axios";
import { Collection } from "@/lib/types";

import { ItemCard } from "@/components/items/ItemCard";
import { ShareModal } from "@/components/collections/ShareModal";
import { MemberAvatar } from "@/components/collections/MemberAvatar";
import { useSearchContext } from "@/lib/context/SearchContext";

export default function CollectionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const { useCollectionDetail } = useCollections();
    const { sendInvite } = useInvites();
    const api = useApi();

    const { data: collection, mutate, isLoading: isFetching, error: fetchError } = useCollectionDetail(id);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    
    const { searchQuery, isSearching, searchResults, clearSearch } = useSearchContext();

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
        await mutate(
            (prev) => prev ? { ...prev, itemIds: prev.itemIds.filter((it) => it._id !== itemId) } : prev,
            { revalidate: false }
        );

        try {
            await api.delete(`/api/items/delete-item/${itemId}`);
            toast.success("Item deleted");
        } catch (error) {
            toast.error("Failed to delete item");
        } finally {
            mutate();
        }
    };

    if (!isLoaded || isFetching) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    if (fetchError || !collection) {
        const errorMessage = fetchError?.response?.status === 403 
            ? "You do not have permission to view this collection."
            : "Collection not found or access denied.";

        return (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h1 className="text-xl font-bold text-foreground mb-2">Access Denied</h1>
                <p className="text-muted-foreground text-sm mb-6 max-w-md">{errorMessage}</p>
                <button
                    onClick={() => router.push("/collections")}
                    className="text-primary hover:underline text-sm font-medium transition-colors"
                >
                    &larr; Back to Collections
                </button>
            </div>
        );
    }

    const isOwner = collection.owner.clerkId === user?.id;
    const memberCount = collection.members.length + 1;

    const isSearchActive = searchQuery.trim().length > 0;
    
    // Determine which items to show: if searching, intersect global results with this collection's items
    const displayedItems = isSearchActive
        ? searchResults.filter(result => collection.itemIds.some(item => item._id === result._id))
        : collection.itemIds;

    return (
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
            {/* Header Area */}
            <div className="flex flex-col gap-6 mb-8 lg:mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => router.push("/collections")}
                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Collections
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-muted rounded-xl text-primary">
                                <FolderHeart className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                    {collection.name}
                                </h1>
                                {!isOwner && (
                                    <p className="text-[13px] text-muted-foreground font-medium mt-0.5">
                                        by {collection.owner.firstName} {collection.owner.lastName}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-muted p-1.5 pl-4 rounded-xl border border-border overflow-visible">
                        {/* Members Card */}
                        <div className="flex items-center gap-3 pr-4 border-r border-border overflow-visible">
                            <div className="flex items-center text-xs font-medium text-muted-foreground">
                                <Users className="w-4 h-4 mr-2" />
                                <span className="mr-2.5">{memberCount}</span>
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
                                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        )}
                    </div>
                </div>

                {/* Subtitle / Description if any */}
                <div className="text-[13px] text-muted-foreground font-medium border-t border-border pt-4 flex items-center justify-between">
                    <span>
                        {collection.itemIds.length} {collection.itemIds.length === 1 ? "item" : "items"} saved in this collection
                    </span>
                    {isSearchActive && (
                        <span>
                            {displayedItems.length} result{displayedItems.length !== 1 ? "s" : ""} found
                        </span>
                    )}
                </div>
            </div>

            {/* Content Area */}
            {collection.itemIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] bg-card rounded-2xl text-center p-8">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <FolderHeart className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">This collection is empty</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                        Add items to this collection from your Dashboard or use the browser extension.
                    </p>
                </div>
            ) : isSearchActive && displayedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 w-full max-w-md mx-auto">
                    <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <SearchX className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">No results in collection</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        Nothing matched &ldquo;{searchQuery}&rdquo; in {collection.name}. Let's clear your search and try again.
                    </p>
                    <button
                        onClick={clearSearch}
                        className="text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg transition-colors"
                    >
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 sm:gap-6">
                    {displayedItems.map((item, index) => (
                        <div 
                            key={item._id || `item-${index}`} 
                            className="break-inside-avoid mb-5 sm:mb-6 inline-block w-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                            style={{ animationDelay: `${Math.min(index * 30, 400)}ms` }}
                        >
                            <ItemCard
                                item={item}
                                onDelete={handleDeleteItem}
                            />
                        </div>
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
