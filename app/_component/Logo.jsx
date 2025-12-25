import Image from "next/image";
import Link from "next/link";
function Logo() {
  return (
    <Link href={"/"}>
    <div className={`flex gap-2 items-center justify-center py-2 `}>
      <Image src={"/ball.png"} height={30} width={30} alt="logo" />
      <h1>Poke 芒</h1>
    </div>
    </Link>
  );
}

export default Logo;
