"use client"

import { useMutation } from "convex/react"
import { ConvexError } from "convex/values"
import { useState } from "react"
import type { Id } from "../../convex/_generated/dataModel"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { toast } from "sonner"
import { api } from "../../convex/_generated/api"

type RenameDialogProps = {
	documentId: Id<"documents">
	initialTitle: string
	children: React.ReactNode
}

export const RenameDialog = ({
	documentId,
	initialTitle,
	children,
}: RenameDialogProps) => {
	const rename = useMutation(api.documents.updateById)
	const [isRenaming, setIsRenaming] = useState(false)

	const [title, setTitle] = useState(initialTitle)
	const [open, setOpen] = useState(false)

	const handleRename = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsRenaming(true)

		if (title.trim() === initialTitle) {
			setIsRenaming(false)
			setOpen(false)
			return
		}

		try {
			await rename({ id: documentId, title: title.trim() || "Untitled" })
			toast.success("Document renamed successfully")
		} catch (error) {
			if (error instanceof ConvexError) toast.error(error.data)
			else toast.error("An error occurred while renaming the document")
		}

		setIsRenaming(false)
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent onClick={(e) => e.stopPropagation()}>
				<form onSubmit={handleRename}>
					<DialogHeader>
						<DialogTitle>Rename Document</DialogTitle>
						<DialogDescription>
							Enter a new name for this document.
						</DialogDescription>
					</DialogHeader>
					<div className="my-4">
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onClick={(e) => e.stopPropagation()}
							disabled={isRenaming}
							placeholder="Document title"
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="ghost"
							disabled={isRenaming}
							onClick={(e) => {
								e.stopPropagation()
								setOpen(false)
							}}>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isRenaming}
							onClick={(e) => {
								e.stopPropagation()
								setOpen(false)
							}}>
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
