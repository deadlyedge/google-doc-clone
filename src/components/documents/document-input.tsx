import { useStatus } from "@liveblocks/react"
import { useMutation } from "convex/react"
import { useRef, useState } from "react"
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs"
import { toast } from "sonner"

import { useDebounce } from "@/hooks/use-debounce"

import { LoaderIcon } from "lucide-react"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"

type DocumentInputProps = {
	title: string
	id: Id<"documents">
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
	const status = useStatus()

	const [value, setValue] = useState(title || "Untitled Document")

	const [isPending, setIsPending] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)

	const mutate = useMutation(api.documents.updateById)

	const debouncedUpdate = useDebounce(async (newValue: string) => {
		if (newValue === title) return
		setIsPending(true)
		try {
			await mutate({ id, title: newValue.trim() })
			setIsPending(false)
			setValue(newValue.trim())
			toast.success("Document title updated")
		} catch (error) {
			toast.error(`Failed to update document title: ${error}`)
		}
	}, 500)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setIsPending(true)
		try {
			await mutate({ id, title: value.trim() })
			setIsPending(false)
			setValue(value.trim())
			toast.success("Document title updated")
			setIsEditing(false)
			inputRef.current?.blur()
		} catch (error) {
			toast.error(`Failed to update document title: ${error}`)
			setIsPending(false)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		setValue(newValue)
		debouncedUpdate(newValue.trim())
	}

	const showLoader =
		isPending || status === "connecting" || status === "reconnecting"

	const showError = status === "disconnected"

	return (
		<div className="flex items-center gap-2">
			{isEditing ? (
				<form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
					<span className="invisible whitespace-pre px-1.5 text-lg">
						{value || " "}
					</span>
					<input
						type="text"
						ref={inputRef}
						value={value}
						onChange={handleChange}
						onBlur={() => setIsEditing(false)}
						className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
					/>
				</form>
			) : (
				<span
					onClick={() => {
						setIsEditing(true)
						setTimeout(() => {
							inputRef.current?.focus()
						}, 0)
					}}
					className="text-lg px-1.5 cursor-pointer truncate">
					{title || "Untitled Document"}
				</span>
			)}
			{!showError && !showLoader && <BsCloudCheck className="text-green-500" />}
			{showLoader && (
				<LoaderIcon className="size-4 animate-spin text-muted-foreground" />
			)}
			{showError && <BsCloudSlash className="text-red-500" />}
		</div>
	)
}
