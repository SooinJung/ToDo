// components/Logo.tsx
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
      <a>
        <img src="/img/Size=Large.svg" alt="Logo" className="cursor-pointer" />
      </a>
    </Link>
  );
};

export default Logo;
