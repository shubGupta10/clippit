import { FC } from "react";
import { Collection } from "@/lib/types";
import { Trash2, Users, FolderHeart, Share2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface CollectionCardProps {
    collection: Collection;
    onDelete?: (id: string) => void;
    onShare?: (id: string) => void;
    onClick?: () => void;
}

export const CollectionCard: FC<CollectionCardProps> = ({ collection, onDelete, onShare, onClick }) => {
    const { user } = useUser();
    const isOwner = user?.id === collection.owner.clerkId;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete(collection._id);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onShare) onShare(collection._id);
    };

    return (
        <div 
            onClick={onClick}
            className="group relative flex flex-col bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
            <div className="absolute inset-x-0 -top-px h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                    <FolderHeart className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                    {isOwner && onShare && (
                        <button 
                            onClick={handleShare}
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Share collection"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    )}
                    {isOwner && onDelete && (
                        <button 
                            onClick={handleDelete}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete collection"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-foreground tracking-tight line-clamp-1 mb-1">
                    {collection.name}
                </h3>
                {!isOwner && (
                    <p className="text-xs text-muted-foreground mb-3">
                        by {collection.owner.firstName} {collection.owner.lastName}
                    </p>
                )}
                
                <div className="mt-auto pt-4 flex items-center justify-between text-sm text-muted-foreground border-t border-border/50">
                    <span className="font-medium">
                        {collection.itemIds?.length || 0} {collection.itemIds?.length === 1 ? "item" : "items"}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{(collection.members?.length || 0) + 1}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
