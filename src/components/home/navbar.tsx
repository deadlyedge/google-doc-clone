import Image from "next/image"
import Link from "next/link"
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs"

import { SearchInput } from "./search-input"

export const Navbar = () => {
	return (
		<nav className="flex items-center justify-between h-full w-full">
			<div className="flex gap-3 shrink-0 items-center pr-6">
				<Link href="/">
					<Image
						src="/logo.svg"
						alt="Logo"
						width={400}
						height={36}
						className="h-8 w-auto"
					/>
				</Link>
				<h3 className="text-xl">Docs</h3>
			</div>
			<SearchInput />
			<div className="flex gap-3 items-center pl-6">
				<OrganizationSwitcher
					afterCreateOrganizationUrl="/"
					afterSelectOrganizationUrl="/"
					afterLeaveOrganizationUrl="/"
					afterSelectPersonalUrl="/"
				/>
				<UserButton />
			</div>
		</nav>
	)
}
