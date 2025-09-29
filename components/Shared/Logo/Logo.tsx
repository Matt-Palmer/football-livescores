import Image from "next/image";

type Props = {
  width: string;
  height: string;
  image_path: string;
  rounded: boolean;
  alt: string;
}

function Logo({width, height, image_path, rounded, alt}: Props) {
  return (
    <div
      className={`relative h-[${height}] w-[${width}] ${
        rounded ? "rounded-2xl overflow-hidden" : ""
      }`}
    >
      <Image
        src={image_path}
        fill={true}
        alt={alt}
        style={{ objectFit: "cover" }}
        sizes={`(max-width: 1200px) ${width}, ${height}`}
      />
    </div>
  );
}

export default Logo
