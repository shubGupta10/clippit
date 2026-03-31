import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePlanLimits } from "@/lib/hooks/usePlanLimits";

interface CreateCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
}

export function CreateCollectionModal({ isOpen, onClose, onSubmit }: CreateCollectionModalProps) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { checkLimit } = usePlanLimits();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        // Check plan limits before continuing
        if (!checkLimit('collections')) return;

        setIsLoading(true);
        try {
            await onSubmit(name.trim());
            setName("");
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Collection</DialogTitle>
                    <DialogDescription>
                        Give your new collection a name to organize your saved items.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Input
                            id="name"
                            placeholder="e.g. Design Inspiration"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!name.trim() || isLoading}>
                            {isLoading ? "Creating..." : "Create Collection"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
