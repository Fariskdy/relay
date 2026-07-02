import type { Member } from "@/lib/types";
import { classNames } from "@/lib/format";

type AvatarProps = {
  member: Member;
  members: Member[];
  size?: number;
  className?: string;
};

export function Avatar({ member, members, size = 32, className }: AvatarProps) {
  const index = Math.max(0, members.findIndex((item) => item.id === member.id));

  return (
    <div
      className={classNames("grid shrink-0 place-items-center rounded-full text-[11px] font-medium text-white", className)}
      style={{ width: size, height: size, backgroundColor: `var(--avatar-${(index % 5) + 1})` }}
      aria-label={member.name}
      title={member.name}
    >
      {member.initials}
    </div>
  );
}

type AvatarStackProps = {
  members: Member[];
  allMembers: Member[];
  max?: number;
};

export default function AvatarStack({ members, allMembers, max = 3 }: AvatarStackProps) {
  const visible = members.slice(0, max);
  const overflow = Math.max(0, members.length - visible.length);

  return (
    <div className="flex items-center">
      {visible.map((member, index) => (
        <Avatar
          key={member.id}
          member={member}
          members={allMembers}
          size={22}
          className={classNames("ring-2 ring-surface-raised", index > 0 && "-ml-2")}
        />
      ))}
      {overflow > 0 ? (
        <div className="-ml-2 grid h-[22px] w-[22px] place-items-center rounded-full bg-surface-overlay text-[10px] font-medium text-text-secondary ring-2 ring-surface-raised">
          +{overflow}
        </div>
      ) : null}
    </div>
  );
}
