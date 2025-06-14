"use client"

import { useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"
import type { Id } from "../../convex/_generated/dataModel"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { ConvexError } from "convex/values"
import { api } from "../../convex/_generated/api"

type RemoveDialogProps = {
	documentId: Id<"documents">
	children: React.ReactNode
}

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
	const remove = useMutation(api.documents.removeById)
	const [isRemoving, setIsRemoving] = useState(false)

	const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()

		setIsRemoving(true)
		try {
			await remove({ id: documentId })
			toast.success("Document removed successfully")
		} catch (error) {
			if (error instanceof ConvexError) toast.error(error.data)
			else toast.error("An error occurred while removing the document")
		} finally {
			setIsRemoving(false)
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent onClick={(e) => e.stopPropagation()}>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						document.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={(e) => e.stopPropagation()}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={(e) => handleRemove(e)}
						disabled={isRemoving}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
