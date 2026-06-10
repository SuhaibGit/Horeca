import type { SocialPlatformId } from "./types";

interface SocialPlatformIconProps {
  platform: SocialPlatformId;
  className?: string;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)" />
      <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
      <defs>
        <linearGradient id="ig" x1="2" y1="22" x2="22" y2="2">
          <stop stopColor="#FD5949" />
          <stop offset="0.5" stopColor="#D6249F" />
          <stop offset="1" stopColor="#285AEB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#0A66C2" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#1877F2" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#FFFC00" className={className}>
      <path
        stroke="#000"
        strokeWidth="0.5"
        d="M12 2c2.5 0 4.5 2.2 4.5 5.2 0 .8-.2 1.5-.5 2.2 1.2.3 2.3.8 3.2 1.5-.3.6-.9 1-1.6 1.2.4.5.6 1.1.6 1.7 0 1.5-1.5 2.7-3.4 2.9.3.5.5 1 .5 1.6 0 .3-.1.6-.2.8 1.2.4 2 1 2 1.7 0 .5-.4 1-1.1 1.3-.5.2-1.1.3-1.7.3-.6 0-1.2-.1-1.7-.3-1.2-.5-2.1-1.2-2.1-2 0-.6.2-1.1.5-1.6-1.9-.2-3.4-1.4-3.4-2.9 0-.6.2-1.2.6-1.7-.7-.2-1.3-.6-1.6-1.2.9-.7 2-1.2 3.2-1.5-.3-.7-.5-1.4-.5-2.2C7.5 4.2 9.5 2 12 2z"
      />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#FF0000" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const SocialPlatformIcon = ({ platform, className = "h-8 w-8" }: SocialPlatformIconProps) => {
  switch (platform) {
    case "instagram":
      return <InstagramIcon className={className} />;
    case "twitter":
      return <TwitterIcon className={`${className} text-[#111827]`} />;
    case "linkedin":
      return <LinkedInIcon className={className} />;
    case "facebook":
      return <FacebookIcon className={className} />;
    case "tiktok":
      return <TikTokIcon className={`${className} text-[#111827]`} />;
    case "snapchat":
      return <SnapchatIcon className={className} />;
    case "youtube":
      return <YoutubeIcon className={className} />;
    default:
      return null;
  }
};

export default SocialPlatformIcon;
