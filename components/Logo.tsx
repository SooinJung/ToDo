// components/Logo.tsx
import Link from 'next/link';

const Logo = () => (
  <Link href="/">
    <img src="/img/logo_large.svg" alt="Logo" className="cursor-pointer" />
  </Link>
);

export default Logo;
