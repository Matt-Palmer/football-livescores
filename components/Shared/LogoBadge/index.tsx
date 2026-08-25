import Image from "next/image";

type LogoBadgeProps = {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
};

/**
 * A league/country logo on a light circular backdrop, so a dark crest (e.g.
 * the Scottish league logo) doesn't disappear into the app's dark
 * background. Not for team badges — those already read fine on dark.
 *
 * `inset-[15%]` rather than a fixed pixel inset keeps the padding
 * proportional at every breakpoint the caller's `className` sizes the badge
 * to, without needing matching breakpoints here.
 */
function LogoBadge({ src, alt, className, sizes, priority }: LogoBadgeProps) {
  return (
    <span
      className={`relative shrink-0 rounded-full bg-white overflow-hidden ${className}`}
    >
      <span className="absolute inset-[15%]">
        <Image
          src={src || "/default-team-logo.svg"}
          fill={true}
          alt={alt}
          style={{ objectFit: "contain" }}
          sizes={sizes}
          priority={priority}
        />
      </span>
    </span>
  );
}

export default LogoBadge;
