import Image from 'next/image';

export default function Logo({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const width = size === 'md' ? 108 : 52;

  return (
    <Image
      src="/logo-fonil-v4.png"
      alt="Fonil Company"
      height={1223}
      width={1138}
      sizes={`${width}px`}
      preload
      className="shrink-0"
      style={{ width, maxWidth: '100%', height: 'auto' }}
    />
  );
}
