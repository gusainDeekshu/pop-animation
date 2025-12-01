import Link from "next/link";


export default function Nav() {
  return (
    <nav>
        <Link href="/">Home</Link>
        <Link href="/station">Station</Link>
        <Link href="/gateway">Gateway</Link>    
        <Link href="/colony">Colony</Link>
    </nav>
  );
}
