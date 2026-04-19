import Image from "next/image";

type FigureProps = {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  credit?: React.ReactNode;
  width?: number;
  height?: number;
};

export function Figure({
  src,
  alt,
  caption,
  credit,
  width = 1200,
  height = 630,
}: FigureProps) {
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg border border-rule bg-bg-soft">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 720px) 100vw, 720px"
          className="h-auto w-full"
        />
      </div>
      {(caption || credit) && (
        <figcaption className="mt-3 text-sm text-ink-3 leading-relaxed">
          {caption}
          {caption && credit ? " " : null}
          {credit && <span className="italic">— {credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
