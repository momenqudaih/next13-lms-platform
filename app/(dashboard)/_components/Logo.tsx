import Image from 'next/image';

export const Logo = () => (
    <Image
        src="/logo.svg"
        alt="Logo"
        width={130}
        height={130}
        className="logo"
    />
);
