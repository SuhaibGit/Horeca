import Link from "next/link";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

const PrimaryButton = ({
  children,
  onClick,
  href,
  disabled,
  className = "",
}: PrimaryButtonProps) => {
  const styles = `flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-6 py-3.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50 ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
};

export default PrimaryButton;
