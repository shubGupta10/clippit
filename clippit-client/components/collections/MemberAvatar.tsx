import { FC } from "react";

interface MemberAvatarProps {
    firstName: string;
    lastName: string;
    fullName?: string;
    tooltipAlign?: 'left' | 'center' | 'right';
}

export const MemberAvatar: FC<MemberAvatarProps> = ({ firstName, lastName, fullName, tooltipAlign = 'center' }) => {
    const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
    const displayName = fullName || `${firstName} ${lastName}`;

    const alignClasses = {
        center: "left-1/2 -translate-x-1/2",
        right: "right-0 translate-x-0 left-auto",
        left: "left-0 translate-x-0"
    };

    return (
        <div 
            className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border-2 border-background text-primary text-xs font-bold shadow-sm cursor-default"
        >
            {initials || "?"}

            {/* Tooltip */}
            <div className={`absolute -top-10 ${alignClasses[tooltipAlign]} scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-[100]`}>
                {displayName}
            </div>
        </div>
    );
};
