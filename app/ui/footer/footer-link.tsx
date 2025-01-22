import Link from "next/link";

export default function FooterLink({
	children,
	href,
	className,
} : {
	children: React.ReactNode
	href: string;
	className: string;
}) {
	return (
		<Link
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={className}
		>
			{children}
		</Link>
	);
}
