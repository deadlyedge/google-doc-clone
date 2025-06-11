import {
	ExternalLinkIcon,
	FilePenIcon,
	MoreVerticalIcon,
	TrashIcon,
} from "lucide-react"
import type { Id } from "../../../convex/_generated/dataModel"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { RemoveDialog } from "../remove-dialog"
import { RenameDialog } from "../rename-dialog"

type DocumentMenuProps = {
	documentId: Id<"documents">
	title: string
	onNewTabClick: (id: Id<"documents">) => void
}

export const DocumentMenu = ({
	documentId,
	title,
	onNewTabClick,
}: DocumentMenuProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<MoreVerticalIcon className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<RenameDialog documentId={documentId} initialTitle={title}>
					<DropdownMenuItem
						onSelect={(e) => e.preventDefault()}
						onClick={(e) => e.stopPropagation()}>
						<FilePenIcon className="size-4 mr-2" />
						Rename
					</DropdownMenuItem>
				</RenameDialog>
				<RemoveDialog documentId={documentId}>
					<DropdownMenuItem
						className="text-red-600"
						onSelect={(e) => e.preventDefault()}
						onClick={(e) => e.stopPropagation()}>
						<TrashIcon className="size-4 mr-2" />
						Remove
					</DropdownMenuItem>
				</RemoveDialog>

				<DropdownMenuItem onClick={() => onNewTabClick(documentId)}>
					<ExternalLinkIcon className="size-4 mr-2" />
					Open in new tab
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
