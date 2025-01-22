import Image from 'next/image';
import { Email, GitHub, Resume } from '@/app/lib/ref-links';
import { DocumentIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import FooterLink from '@/app/ui/footer/footer-link';

export default function Footer() {
	const footerLinkClass = "flex items-center gap-2 hover:underline hover:underline-offset-4";

	return (
		<footer className="row-start-3 flex flex-col sm:flex-row gap-6 flex-wrap items-center justify-center px-8">
			{/* GitHub */}
		  <FooterLink
				href={GitHub}
				className={footerLinkClass}
			>
				{/* Light-mode Icon */}
				<Image
					aria-hidden
					src="/icons/github-mark-dark.svg"
					alt="GitHub icon"
					width={16}
					height={16}
					className="inline"
				/>
				<span>GitHub</span>
			</FooterLink>
			{/* Resume */}
		  <FooterLink
				href={Resume}
				className={footerLinkClass}
		  >
				<DocumentIcon className="w-5"/>
				<span>Resume</span>
		  </FooterLink>
			{/* Email */}
			<div
				className={`${footerLinkClass} hover:cursor-pointer`}
			>
				<EnvelopeIcon className="w-5"/>
				<span className="select-all">{Email}</span>
			</div>
		</footer>
	);
}
