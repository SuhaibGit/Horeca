const ReviewSubmittedIllustration = () => {
  return (
    <div className="relative mx-auto flex h-52 w-full max-w-xs items-end justify-center">
      <div className="absolute top-0 flex h-16 w-16 items-center justify-center rounded-full bg-[#0A46A6] shadow-lg">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" aria-hidden>
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <svg viewBox="0 0 280 160" className="mt-10 w-full max-w-[260px]" aria-hidden>
        <ellipse cx="140" cy="148" rx="120" ry="8" fill="#E2E8F0" />
        <rect x="70" y="70" width="140" height="70" rx="4" fill="#041B40" />
        <rect x="78" y="78" width="124" height="54" rx="2" fill="#0A46A6" />
        <rect x="95" y="95" width="22" height="18" rx="2" fill="#93C5FD" />
        <rect x="129" y="95" width="22" height="18" rx="2" fill="#93C5FD" />
        <rect x="163" y="95" width="22" height="18" rx="2" fill="#93C5FD" />
        <rect x="118" y="118" width="44" height="22" rx="2" fill="#BFDBFE" />
        <polygon points="70,70 140,35 210,70" fill="#0A46A6" />
        <rect x="128" y="48" width="24" height="18" rx="2" fill="#BFDBFE" />
        <text x="140" y="62" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
          HORECAS
        </text>
        <rect x="55" y="108" width="8" height="32" rx="2" fill="#64748B" />
        <rect x="217" y="108" width="8" height="32" rx="2" fill="#64748B" />
        <circle cx="59" cy="102" r="6" fill="#FBBF24" opacity="0.9" />
        <circle cx="221" cy="102" r="6" fill="#FBBF24" opacity="0.9" />
      </svg>
    </div>
  );
};

export default ReviewSubmittedIllustration;
