import Image from 'next/image';

export default function Logo({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const width = size === 'md' ? 260 : 180;

  return (
    // Frame the artwork without the large transparent margins in the source PNG.
    <div
      className="relative overflow-hidden shrink-0"
      style={{ width, maxWidth: '100%', aspectRatio: '1000 / 340' }}
    >
      <Image
        src="/logo-metodo-sac.png"
        alt="Método S.A.C — Sistema de Aquisição de Clientes"
        height={1000}
        width={1000}
        sizes={`${width}px`}
        preload
        className="absolute left-0 top-1/2 w-full -translate-y-1/2"
        style={{ height: 'auto' }}
      />
    </div>
  );
}
