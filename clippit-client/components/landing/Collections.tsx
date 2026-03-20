import { Folder, Users, Type, Image as ImageIcon, Link as LinkIcon, Eye, Edit } from "lucide-react";

export function Collections() {
  return (
    <section id="collections" className="py-24 md:py-32 bg-background border-t border-border/50">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Collections & Collaborate
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.02em] text-foreground md:text-5xl">
            Store things your way. Share them when you want.
          </h2>
        </div>

        <div className="mt-20 md:mt-32 space-y-24 md:space-y-40">
          
          {/* Row 1: Private Collection */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
             <div className="order-2 md:order-1">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border shadow-sm text-foreground mb-6">
                  <Folder className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                  Create collection
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Create collections to organize your links, documents, and notes exactly how you want. Everything is private by default, acting as your personal knowledge base.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Group related resources logically</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Support for links, images, and text notes</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>100% private to you</span>
                  </li>
                </ul>
             </div>
             {/* Mockup */}
             <div className="order-1 md:order-2 rounded-[2rem] border border-border bg-card p-6 sm:p-8 shadow-sm">
                <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden pointer-events-none">
                  <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                      <span className="font-medium text-foreground">Landing Page Inspo ✦</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted/50 border border-border text-muted-foreground">Private</span>
                  </div>
                  <div className="p-3 space-y-2 bg-muted/5">
                     <div className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border/50">
                        <LinkIcon className="w-5 h-5 text-blue-500 shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium text-foreground truncate">Stripe Layout Reference</span>
                          <span className="text-xs text-muted-foreground truncate">stripe.com/payments</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border/50">
                        <ImageIcon className="w-5 h-5 text-purple-500 shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium text-foreground truncate">hero_section_v3_final.png</span>
                          <span className="text-xs text-muted-foreground">Added 2 hours ago</span>
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Row 2: Share and Collaborate */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
             {/* Mockup */}
             <div className="order-2 md:order-1 rounded-[2rem] border border-border bg-card p-6 sm:p-8 shadow-sm">
                <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden pointer-events-none">
                  <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-amber-500" />
                      <span className="font-medium text-foreground">Landing Page Inspo ✦</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white z-20">JD</div>
                        <div className="w-7 h-7 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground z-10">AS</div>
                      </div>
                      <div className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium">Invite</div>
                    </div>
                  </div>
                  <div className="p-3 space-y-2 bg-muted/5">
                     <div className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border/50">
                        <LinkIcon className="w-5 h-5 text-blue-500 shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium text-foreground truncate">Stripe Layout Reference</span>
                          <span className="text-xs text-muted-foreground truncate">stripe.com/payments</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-primary/30 shadow-[0_0_0_1px_rgba(var(--primary),0.1)]">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <Type className="w-5 h-5 text-emerald-500 shrink-0" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-foreground truncate">Hero Copy Ideas</span>
                            <span className="text-xs text-muted-foreground">Drafting text...</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-primary ml-2 shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Editing
                        </div>
                     </div>
                  </div>
                </div>
             </div>
             <div className="order-1 md:order-2">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border shadow-sm text-foreground mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                  Invite anyone
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Share access with friends or coworkers instantly. Once invited, they can view your collection, edit items, and contribute their own saves in real-time.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Granular View or Edit permissions</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Instantly revoke access anytime</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Collaborate and build together</span>
                  </li>
                </ul>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
