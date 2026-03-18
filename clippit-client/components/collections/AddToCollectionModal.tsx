import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collection } from "@/lib/types";
import { FolderHeart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollections } from "@/lib/hooks/useCollections";
import { toast } from "sonner";

interface AddToCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: string;
    currentCollectionId?: string;
    onSuccess?: () => void;
}

export function AddToCollectionModal({ isOpen, onClose, itemId, currentCollectionId, onSuccess }: AddToCollectionModalProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    
    const { getCollections, addItemToCollection } = useCollections();

    useEffect(() => {
        if (isOpen) {
            fetchCollections();
        }
    }, [isOpen]);

    const fetchCollections = async () => {
        setIsFetching(true);
        try {
            const res = await getCollections();
            if (res.success) {
                setCollections(res.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load collections");
        } finally {
            setIsFetching(false);
        }
    };

    const handleSelect = async (collectionId: string) => {
        setIsLoading(collectionId);
        try {
            await addItemToCollection(collectionId, itemId);
            toast.success("Item added to collection");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add component to collection");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Save to Collection</DialogTitle>
                    <DialogDescription>
                        Choose a collection to save this item to.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2 py-4">
                    {isFetching ? (
                         <div className="text-center py-6 text-muted-foreground text-sm animate-pulse">
                            Loading collections...
                         </div>
                    ) : collections.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                            <FolderHeart className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p>No collections available.</p>
                            <p>Create one in the Collections tab.</p>
                        </div>
                    ) : (
                        collections.map((collection) => {
                            const isSelected = collection._id === currentCollectionId;
                            return (
                                <div
                                    key={collection._id}
                                    onClick={() => {
                                        if (!isSelected && isLoading === null) {
                                            handleSelect(collection._id);
                                        }
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group
                                        ${isSelected 
                                            ? "bg-primary/5 border-primary shadow-sm" 
                                            : "bg-card border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer"}
                                        ${isLoading === collection._id ? "opacity-50 cursor-wait pointer-events-none" : ""}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary transition-colors"}`}>
                                            <FolderHeart className="w-4 h-4" />
                                        </div>
                                        <span className={`font-medium text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                                            {collection.name}
                                        </span>
                                    </div>
                                    
                                    {isSelected && (
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    )}
                                    
                                    {!isSelected && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                {isLoading === collection._id ? "Adding..." : "Save"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
