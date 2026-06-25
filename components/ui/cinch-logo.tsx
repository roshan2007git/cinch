import Link from "next/link";
import Image from "next/image";

export default function CinchLogo() {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/cinch-logo.png" alt="Cinch" width={140} height={140} className="h-12 w-auto" />
    </Link>
  );
}
