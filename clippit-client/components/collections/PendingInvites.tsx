import { Invite } from "@/lib/types";
import { CheckCircle2, XCircle, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendingInvitesProps {
    invites: Invite[];
    onAccept: (id: string) => Promise<void>;
    onDecline: (id: string) => Promise<void>;
}

export function PendingInvites({ invites, onAccept, onDecline }: PendingInvitesProps) {
    if (!invites || invites.length === 0) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Pending Invites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {invites.map((invite) => (
                    <div key={invite._id} className="bg-card border border-primary/20 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
                                <MailOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-0.5">
                                    {invite.collectionId?.name || "Shared Collection"}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    Invited by {invite.owner.firstName} {invite.owner.lastName}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => onAccept(invite._id)}
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-9"
                                size="sm"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                Accept
                            </Button>
                            <Button
                                onClick={() => onDecline(invite._id)}
                                variant="outline"
                                className="flex-1 border-muted hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 h-9"
                                size="sm"
                            >
                                <XCircle className="w-4 h-4 mr-1.5" />
                                Decline
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
