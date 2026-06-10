interface FloralLeafProps {
  className?: string;
}

export default function FloralLeaf({ className }: FloralLeafProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/decorations/floral-leaf.svg"
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}
