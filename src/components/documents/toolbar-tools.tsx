"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import type { Level } from "@tiptap/extension-heading"
import { CirclePicker, type ColorResult, SketchPicker } from "react-color"

import {
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon,
	ChevronDownIcon,
	HighlighterIcon,
	ImageIcon,
	Link2Icon,
	ListCollapseIcon,
	ListIcon,
	ListOrderedIcon,
	MinusIcon,
	PlusIcon,
	SearchIcon,
	UploadIcon,
} from "lucide-react"

import { useEditorStore } from "@/store/use-editor-store"

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const LineHeightButton = () => {
	const { editor } = useEditorStore()

	const lineHeights = [
		{ label: "Default", value: "normal" },
		{ label: "Single", value: "1" },
		{ label: "1.15", value: "1.15" },
		{ label: "1.5", value: "1.5" },
		{ label: "Double", value: "2" },
	]

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
					<ListCollapseIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-1 flex flex-col gap-y-1">
				{lineHeights.map(({ label, value }) => (
					<button
						type="button"
						key={value}
						onClick={() => editor?.chain().focus().setLineHeight(value).run()}
						className={cn(
							"flex items-center gap-x-2 p-2 rounded-sm hover:bg-neutral-200/80",
							editor?.getAttributes("paragraph").lineHeight === value &&
								"bg-neutral-200/80",
						)}>
						<span className="text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const FontSizeButton = () => {
	const { editor } = useEditorStore()

	const currentFontSize = editor?.getAttributes("textStyle").fontSize
		? editor?.getAttributes("textStyle").fontSize.replace("px", "")
		: "16"

	const [fontSize, setFontSize] = useState(currentFontSize)
	const [inputValue, setInputValue] = useState(fontSize)
	const [isEditing, setIsEditing] = useState(false)

	// Sync fontSize and inputValue with currentFontSize when selection changes
	useEffect(() => {
		setFontSize(currentFontSize)
		setInputValue(currentFontSize)
	}, [currentFontSize])

	const updateFontSize = (newSize: string) => {
		const size = Number.parseInt(newSize)
		if (!Number.isNaN(size) && size > 0) {
			editor?.chain().focus().setFontSize(`${size}px`).run()
			setFontSize(newSize)
			setInputValue(newSize)
			setIsEditing(false)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleInputBlur = () => {
		updateFontSize(inputValue)
	}

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			updateFontSize(inputValue)
			editor?.commands.focus()
		}
	}

	const increment = () => {
		const newSize = Number.parseInt(fontSize) + 1
		updateFontSize(newSize.toString())
	}
	const decrement = () => {
		const newSize = Number.parseInt(fontSize) - 1
		if (newSize > 0 && newSize < 100) {
			updateFontSize(newSize.toString())
		}
	}

	return (
		<div className="flex items-center gap-x-0.5">
			<button
				type="button"
				className="size-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
				onClick={decrement}
				disabled={Number.parseInt(fontSize, 10) <= 1}>
				<MinusIcon className="size-4" />
			</button>
			{isEditing ? (
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					onKeyDown={handleInputKeyDown}
					className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0"
				/>
			) : (
				<button
					type="button"
					className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent cursor-text hover:bg-neutral-200/80"
					onClick={() => {
						setIsEditing(true)
						setFontSize(currentFontSize)
					}}>
					{currentFontSize}
				</button>
			)}
			<button
				type="button"
				className="size-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
				onClick={increment}
				disabled={Number.parseInt(fontSize) < 1}>
				<PlusIcon className="size-4" />
			</button>
		</div>
	)
}

const ListButton = () => {
	const { editor } = useEditorStore()

	const lists = [
		{
			label: "Bullet List",
			value: "bulletList",
			Icon: ListIcon,
			isActive: () => editor?.isActive("bulletList"),
			onClick: () => editor?.chain().focus().toggleBulletList().run(),
		},
		{
			label: "Ordered List",
			value: "orderedList",
			Icon: ListOrderedIcon,
			isActive: () => editor?.isActive("orderedList"),
			onClick: () => editor?.chain().focus().toggleOrderedList().run(),
		},
	]
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
					<ListIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-1 flex flex-col gap-y-1">
				{lists.map(({ label, Icon, onClick, isActive }) => (
					<button
						type="button"
						key={label}
						onClick={onClick}
						className={cn(
							"flex items-center gap-x-2 p-2 rounded-sm hover:bg-neutral-200/80",
							isActive() && "bg-neutral-200/80",
						)}>
						<Icon className="size-4" />
						<span className="text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const AlignButton = () => {
	const { editor } = useEditorStore()

	const alignments = [
		{ label: "Align Left", value: "left", Icon: AlignLeftIcon },
		{ label: "Align Center", value: "center", Icon: AlignCenterIcon },
		{ label: "Align Right", value: "right", Icon: AlignRightIcon },
		{ label: "Justify", value: "justify", Icon: AlignJustifyIcon },
	]

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
					<AlignLeftIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-1 flex flex-col gap-y-1">
				{alignments.map(({ label, value, Icon }) => (
					<button
						type="button"
						key={value}
						onClick={() => editor?.chain().focus().setTextAlign(value).run()}
						className={cn(
							"flex items-center gap-x-2 p-2 rounded-sm hover:bg-neutral-200/80",
							editor?.isActive({ textAlign: value }) && "bg-neutral-200/80",
						)}>
						<Icon className="size-4" />
						<span className="text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const ImageButton = () => {
	const { editor } = useEditorStore()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [imageUrl, setImageUrl] = useState("")

	const handleChange = (src: string) => {
		editor?.chain().focus().setImage({ src }).run()
	}

	const handleUpload = () => {
		const input = document.createElement("input")
		input.type = "file"
		input.accept = "image/*"
		input.onchange = (event) => {
			const file = (event.target as HTMLInputElement).files?.[0]
			if (file) {
				const imageUrl = URL.createObjectURL(file)
				handleChange(imageUrl)
			}
		}
		input.click()
	}

	const handleImageUrlSubmit = () => {
		if (imageUrl) {
			handleChange(imageUrl)
			setImageUrl("")
			setIsDialogOpen(false)
		}
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
						<ImageIcon className="size-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={handleUpload}>
						<UploadIcon className="size-4 mr-2" />
						Upload Image
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
						<SearchIcon className="size-4 mr-2" />
						Paste image url
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Insert Image URL</DialogTitle>
					</DialogHeader>
					<Input
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleImageUrlSubmit()
						}}
						placeholder="Enter image URL"
					/>
					<DialogFooter>
						<Button onClick={handleImageUrlSubmit}>Submit</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
const LinkButton = () => {
	const { editor } = useEditorStore()

	const [value, setValue] = useState("")

	const handleChange = (href: string) => {
		editor?.chain().focus().extendMarkRange("link").setLink({ href }).run()
		setValue("")
	}

	return (
		<DropdownMenu
			onOpenChange={(open) => {
				if (open) setValue(editor?.getAttributes("link").href || "")
			}}>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
					<Link2Icon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
				<Input
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="https://example.com"
				/>
				<Button onClick={() => handleChange(value)} className="h-7">
					Apply
				</Button>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const HighlightColorButton = () => {
	const { editor } = useEditorStore()

	const value = editor?.getAttributes("highlight").color || "#F8E71C"

	const handleChange = (color: ColorResult) => {
		editor?.chain().focus().setHighlight({ color: color.hex }).run()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
					<HighlighterIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-2 overflow-hidden">
				<CirclePicker color={value} onChange={handleChange} />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const TextColorButton = () => {
	const { editor } = useEditorStore()

	const value = editor?.getAttributes("textStyle").color || "#000000"

	const handleChange = (color: ColorResult) => {
		editor?.chain().focus().setColor(color.hex).run()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
					<span className="text-xs">A</span>
					<div className="h-0.5 w-full" style={{ backgroundColor: value }} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0">
				<SketchPicker color={value} onChange={handleChange} />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const HeadingLevelButton = () => {
	const { editor } = useEditorStore()

	const headings = [
		{ label: "Normal text", value: 0, fontSize: "1rem" },
		{ label: "Heading 1", value: 1, fontSize: "1.6rem" },
		{ label: "Heading 2", value: 2, fontSize: "1.4rem" },
		{ label: "Heading 3", value: 3, fontSize: "1.2rem" },
		{ label: "Heading 4", value: 4, fontSize: "1.1rem" },
		{ label: "Heading 5", value: 5, fontSize: "1rem" },
	]

	const getCurrentHeading = () => {
		for (let level = 1; level <= 5; level++) {
			if (editor?.isActive("heading", { level })) {
				return `Heading ${level}`
			}
		}

		return "Normal text"
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
					<span className="truncate">{getCurrentHeading()}</span>
					<ChevronDownIcon className="size-4 ml-2 shrink-0" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-1 flex flex-col gap-y-1">
				{headings.map(({ label, value, fontSize }) => (
					<button
						type="button"
						key={value}
						style={{ fontSize }}
						className={cn(
							"h-7 min-w-7 shrink-0 flex items-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
							(value === 0 && !editor?.isActive("heading")) ||
								(editor?.isActive("heading", { level: value }) &&
									"bg-neutral-200/80"),
						)}
						onClick={() => {
							if (value === 0) {
								editor?.chain().focus().setParagraph().run()
							} else {
								editor
									?.chain()
									.focus()
									.toggleHeading({ level: value as Level })
									.run()
							}
						}}>
						{label}
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const FontFamilyButton = () => {
	const { editor } = useEditorStore()

	// const font = editor?.getAttributes("textStyle").fontFamily
	const fonts = [
		{ label: "Arial", value: "Arial" },
		{ label: "Times New Roman", value: "Times New Roman" },
		{ label: "Courier New", value: "Courier New" },
		{ label: "Verdana", value: "Verdana" },
		{ label: "Georgia", value: "Georgia" },
		{ label: "Comic Sans MS", value: "Comic Sans MS" },
		{ label: "Trebuchet MS", value: "Trebuchet MS" },
		{ label: "Impact", value: "Impact" },
		{ label: "Lucida Console", value: "Lucida Console" },
		{ label: "Tahoma", value: "Tahoma" },
	]

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
					<span className="truncate">
						{editor?.getAttributes("textStyle").fontFamily || "Arial"}
					</span>
					<ChevronDownIcon className="size-4 ml-2 shrink-0" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="p-1 flex flex-col gap-y-1">
				{fonts.map(({ label, value }) => (
					<button
						type="button"
						key={value}
						onClick={() => editor?.chain().focus().setFontFamily(value).run()}
						className={cn(
							"flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
							editor?.getAttributes("textStyle").fontFamily === value &&
								"bg-neutral-200/80",
						)}
						style={{ fontFamily: value }}>
						<span className="text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export {
	FontSizeButton,
	FontFamilyButton,
	ListButton,
	AlignButton,
	LinkButton,
	ImageButton,
	HighlightColorButton,
	TextColorButton,
	HeadingLevelButton,
	LineHeightButton,
}
