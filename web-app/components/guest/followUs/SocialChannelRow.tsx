import { ExternalLink } from "lucide-react";
import SocialPlatformIcon from "./SocialPlatformIcon";
import type { SocialChannel } from "./types";

interface SocialChannelRowProps {
  channel: SocialChannel;
}

const SocialChannelRow = ({ channel }: SocialChannelRowProps) => {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 py-4 last:border-b-0">
      <SocialPlatformIcon platform={channel.platform} className="h-9 w-9 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#111827]">{channel.name}</p>
        <p className="truncate text-xs text-[#64748B]">{channel.handle}</p>
      </div>

      <a
        href={channel.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-4 py-2 text-xs font-semibold text-white"
      >
        {channel.actionLabel}
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
};

export default SocialChannelRow;
