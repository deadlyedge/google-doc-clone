import Link from "next/link"
import Image from "next/image"
import { SearchInput } from "./search-input"
import { BsGithub } from "react-icons/bs"

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
			<div className="mx-4">
				<BsGithub className="size-6" />
			</div>
		</nav>
	)
}
