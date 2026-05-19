import Image from 'next/image';

export default function Logo({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const height = size === 'md' ? 48 : 32;
  const width = Math.round(height * (2658 / 561));

  return (
    <Image
      src="/logo-fonil.png"
      alt="Fonil Company"
      height={height}
      width={width}
      priority
      style={{ height, width: 'auto', maxWidth: width }}
    />
  );
}
