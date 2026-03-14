import { Inbox } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 w-full max-w-md mx-auto">
      <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
        <Inbox className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">Nothing saved yet</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Install the bookmarklet and start saving things you find online across the web.
      </p>
    </div>
  );
}
