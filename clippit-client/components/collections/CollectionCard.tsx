import { FC, useState } from "react";
import { Collection } from "@/lib/types";
import { Trash2, Users, FolderHeart, Share2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CollectionCardProps {
    collection: Collection;
    onDelete?: (id: string) => void;
    onShare?: (id: string) => void;
    onClick?: () => void;
}

export const CollectionCard: FC<CollectionCardProps> = ({ collection, onDelete, onShare, onClick }) => {
    const { user } = useUser();
    const isOwner = user?.id === collection.owner.clerkId;
    const itemCount = collection.itemIds?.length || 0;
    const memberCount = (collection.members?.length || 0) + 1;

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        if (onDelete) onDelete(collection._id);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onShare) onShare(collection._id);
    };

    return (
        <>
            <div
                onClick={onClick}
                className="group relative flex flex-col bg-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 shadow-sm hover:shadow-md border border-border dark:border-secondary active:scale-[0.98]"
            >
                {/* Content Area */}
                <div className="p-4 flex flex-col flex-1">
                    {/* Top Row: Icon + Actions */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-muted rounded-lg transition-colors duration-300">
                            <FolderHeart className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 -translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out">
                            {isOwner && onShare && (
                                <button
                                    onClick={handleShare}
                                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                                    title="Share collection"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            )}
                            {isOwner && onDelete && (
                                <button
                                    onClick={handleDeleteClick}
                                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-md transition-colors cursor-pointer"
                                    title="Delete collection"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Name + Owner */}
                    <div className="flex flex-col gap-1.5">
                        <h3 className="text-[15px] font-semibold text-foreground tracking-tight line-clamp-1">
                            {collection.name}
                        </h3>
                        {!isOwner && (
                            <p className="text-xs text-muted-foreground">
                                by {collection.owner.firstName} {collection.owner.lastName}
                            </p>
                        )}
                        {isOwner && (
                            <p className="text-xs text-muted-foreground">
                                Personal Collection
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer - Edge to Edge */}
                <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-card group-hover:bg-muted transition-colors cursor-pointer">
                    <span className="font-medium">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{memberCount}</span>
                    </div>
                </div>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {collection.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the collection. Items inside will not be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
