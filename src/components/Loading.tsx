import Image from "next/image";

export default function Loading() {
  return (
    <div className="relative w-10 h-10">
      <Image
        className={"animate-spin"}
        src="/LoadIcon.png"
        fill={true}
        alt="loading"
      />
    </div>
  );
}
