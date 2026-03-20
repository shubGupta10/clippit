import { Mail, UserPlus, Shield, Eye, Edit } from "lucide-react";

export function Collaboration() {
  const permissions = [
    {
      icon: <Eye className="h-4 w-4" />,
      role: "Viewer",
      description: "View and search collection content",
      color: "text-blue-500"
    },
    {
      icon: <Edit className="h-4 w-4" />,
      role: "Editor", 
      description: "Add and edit content",
      color: "text-green-500"
    },
    {
      icon: <UserPlus className="h-4 w-4" />,
      role: "Owner",
      description: "Full control and member management",
      color: "text-purple-500"
    }
  ];

  return (
    <section id="collaboration" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Collaboration
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.02em] text-foreground md:text-5xl">
            Better together.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Invite team members and control who sees what.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-serif text-2xl leading-tight tracking-[-0.02em] text-foreground">
              Simple sharing
            </h3>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Send email invites and set permissions. No complex setup.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email invites</h4>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    Send invites directly from Clippit
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Secure sharing</h4>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    Only invited members can access
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-serif text-2xl leading-tight tracking-[-0.02em] text-foreground">
              Role permissions
            </h3>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Choose the right access level for each person.
            </p>
            
            <div className="mt-8 space-y-4">
              {permissions.map((permission, index) => (
                <div key={index} className="flex gap-3 rounded-xl border border-border bg-background p-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border border-border ${permission.color}`}>
                    {permission.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{permission.role}</h4>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
