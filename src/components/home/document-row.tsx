import { SiGoogledocs } from "react-icons/si"
import { Building2Icon, CircleUserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { TableCell, TableRow } from "@/components/ui/table"

import type { Doc } from "../../../convex/_generated/dataModel"

import { DocumentMenu } from "./document-menu"

type DocumentRowProps = {
	document: Doc<"documents">
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
	const router = useRouter()

	const onNewTabClick = (id: string) => {
		window.open(`/documents/${id}`, "_blank")
	}
	return (
		<TableRow
			key={document._id}
			className="cursor-pointer"
			onClick={() => router.push(`/documents/${document._id}`)}>
			<TableCell className="w-[50px]">
				<SiGoogledocs className="text-blue-500 size-6" />
			</TableCell>
			<TableCell className="font-medium md:w-[45%]">{document.title}</TableCell>
			<TableCell className="hidden md:flex text-muted-foreground items-center gap-2">
				{document.organizationId ? (
					<Building2Icon className="size-4" />
				) : (
					<CircleUserIcon className="size-4" />
				)}
				{document.organizationId ? "Organization" : "Personal"}
			</TableCell>
			<TableCell className="text-muted-foreground hidden md:table-cell">
				{format(new Date(document._creationTime), "MMM dd, yyyy")}
			</TableCell>
			<TableCell className="flex justify-end">
				<DocumentMenu
					documentId={document._id}
					title={document.title}
					onNewTabClick={onNewTabClick}
				/>
			</TableCell>
		</TableRow>
	)
}
